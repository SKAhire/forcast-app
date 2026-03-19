import { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  status?: number;
  response?: {
    data?: unknown;
  };
}

function isUpstreamError(
  error: Error,
): error is HttpError & { response: { data: unknown } } {
  return "response" in error && error.response !== undefined;
}

function hasStatus(error: Error): error is HttpError {
  const httpError = error as HttpError;
  return httpError.status !== undefined && typeof httpError.status === "number";
}

export const errorMiddleware = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (isUpstreamError(err)) {
    res.status(502).json({
      error: "Upstream API error",
      detail: err.response.data ?? err.message,
    });
    return;
  }

  if (hasStatus(err)) {
    const status = err.status as number;
    res.status(status).json({ error: err.message });
    return;
  }

  console.error("[Unhandled error]", err);
  res.status(500).json({ error: "Internal server error" });
};

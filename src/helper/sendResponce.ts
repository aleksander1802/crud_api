import { ServerResponse } from 'http';

export function sendResponse<T>(
  res: ServerResponse,
  statusCode: number,
  data?: T,
): void {
  if (!res.headersSent) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  }
}

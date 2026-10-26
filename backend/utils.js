export const maxResumeBytes = 10 * 1024 * 1024;
export const maxJobDescriptionLength = 30_000;
export const maxResumePages = 50;
export const maxResumeTextLength = 40_000;

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export function hasPdfSignature(buffer) {
  return buffer?.subarray(0, 5).toString("ascii") === "%PDF-";
}

/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export const PortalErrorCode = {
  NotFound: "NOT_FOUND",
  Unauthorized: "UNAUTHORIZED",
  InsufficientUserRights: "INSUFFICIENT_USER_RIGHTS",
  Conflict: "CONFLICT",
  Timeout: "TIMEOUT",
  UnexpectedError: "UNEXPECTED_ERROR",
  AlreadyExists: "ALREADY_EXISTS",
  InvalidFile: "INVALID_FILE",
  NonconformPdf: "NONCONFORM_PDF",
  Corrupt: "CORRUPT",
  Locked: "LOCKED",
  XlsxTooManyRows: "XLSX_TOO_MANY_ROWS",
} as const;
export type PortalErrorCode =
  (typeof PortalErrorCode)[keyof typeof PortalErrorCode];

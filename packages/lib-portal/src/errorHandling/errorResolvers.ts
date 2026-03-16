/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isPlainObject } from "remeda";

import { ApiErrorCode } from "@eshg/base-api";

import { PortalError } from "./PortalError";
import { PortalErrorCode } from "./PortalErrorCode";

interface ApiError {
  message: string;
  errorCode?: ApiErrorCode;
}

const STATUS_MAPPING: Record<number, PortalErrorCode> = {
  401: PortalErrorCode.Unauthorized,
  403: PortalErrorCode.InsufficientUserRights,
  504: PortalErrorCode.Timeout,
};

const ERROR_MAPPING: Record<ApiErrorCode, PortalErrorCode> = {
  [ApiErrorCode.NotFound]: PortalErrorCode.NotFound,
  [ApiErrorCode.Conflict]: PortalErrorCode.Conflict,
  [ApiErrorCode.InternalServerError]: PortalErrorCode.UnexpectedError,
  [ApiErrorCode.Unauthorized]: PortalErrorCode.Unauthorized,
  [ApiErrorCode.InsufficientUserRights]: PortalErrorCode.InsufficientUserRights,
  [ApiErrorCode.Timeout]: PortalErrorCode.Timeout,
  [ApiErrorCode.NonconformPdf]: PortalErrorCode.NonconformPdf,

  [ApiErrorCode.BadRequest]: PortalErrorCode.UnexpectedError,
  [ApiErrorCode.UnexpectedError]: PortalErrorCode.UnexpectedError,
  [ApiErrorCode.ConstraintViolation]: PortalErrorCode.UnexpectedError,
  [ApiErrorCode.DataIntegrityViolation]: PortalErrorCode.UnexpectedError,
  [ApiErrorCode.AggregationException]: PortalErrorCode.UnexpectedError,
  [ApiErrorCode.AlreadyExists]: PortalErrorCode.AlreadyExists,
  [ApiErrorCode.InvalidFile]: PortalErrorCode.InvalidFile,
  [ApiErrorCode.CsvInvalidHeader]: PortalErrorCode.CsvInvalidHeader,
  [ApiErrorCode.Corrupt]: PortalErrorCode.Corrupt,
  [ApiErrorCode.Locked]: PortalErrorCode.Locked,
  [ApiErrorCode.MarkedForDeletion]: PortalErrorCode.MarkedForDeletion,
  [ApiErrorCode.XlsxTooManyRows]: PortalErrorCode.XlsxTooManyRows,
  [ApiErrorCode.ServiceUnavailable]: PortalErrorCode.ServiceUnavailable,
};

export function resolveError(error: unknown): PortalError {
  if (error instanceof PortalError) {
    return error;
  }

  return resolveUnknownError(error);
}

function resolveUnknownError(error: unknown): PortalError {
  const originalMessage =
    error instanceof Error ? error.message : "Unknown error";
  return new PortalError({
    errorCode: PortalErrorCode.UnexpectedError,
    message: originalMessage,
    cause: error,
  });
}

export async function resolveErrorResponse(
  response: Response,
): Promise<PortalError> {
  try {
    const { errorCode, message } = await parseApiError(response);
    return new PortalError({
      errorCode: ERROR_MAPPING[errorCode ?? ApiErrorCode.UnexpectedError],
      message: message,
      originalErrorCode: errorCode,
    });
  } catch {
    return resolveUnknownErrorResponse(response);
  }
}

function resolveUnknownErrorResponse(response: Response) {
  return new PortalError({
    errorCode:
      STATUS_MAPPING[response.status] ?? PortalErrorCode.UnexpectedError,
    message: `Response returned error code ${response.status} for ${response.url}`,
  });
}

async function parseApiError(response: Response): Promise<ApiError> {
  const responseJson: unknown = await response.json();

  if (
    isPlainObject(responseJson) &&
    hasMessage(responseJson) &&
    hasOptionalErrorCode(responseJson)
  ) {
    return responseJson;
  }

  throw new Error("Invalid error response");
}

const ERROR_CODES: string[] = Object.values(ApiErrorCode);

function hasMessage(
  error: Record<string, unknown>,
): error is Pick<ApiError, "message"> {
  return "message" in error && typeof error.message === "string";
}

function hasOptionalErrorCode(
  error: Record<string, unknown>,
): error is Pick<ApiError, "errorCode"> {
  if (!("errorCode" in error)) {
    return true;
  }

  return (
    typeof error.errorCode === "string" && ERROR_CODES.includes(error.errorCode)
  );
}

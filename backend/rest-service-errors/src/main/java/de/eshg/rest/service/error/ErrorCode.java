/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

public enum ErrorCode {

  /** Only to be used with the ExceptionHandler for fallBack() */
  UNEXPECTED_ERROR,
  /**
   * Equivalent to http status 400: Bad request. If necessary use a more descriptive ErrorCode
   * instead.
   */
  BAD_REQUEST,
  /** Equivalent to http status 401: Unauthorized */
  UNAUTHORIZED,
  /** Equivalent to http status 403: Forbidden */
  INSUFFICIENT_USER_RIGHTS,
  /** Equivalent to http status 404: Not found */
  NOT_FOUND,
  /** Equivalent to http status 409: Conflict */
  CONFLICT,
  /** Equivalent to http status 500: Internal server error */
  INTERNAL_SERVER_ERROR,
  /** Use when ConstraintViolationException is thrown */
  CONSTRAINT_VIOLATION,
  /** Use when TimeoutException is thrown */
  TIMEOUT,
  /** Use when DataIntegrityViolationException is thrown */
  DATA_INTEGRITY_VIOLATION,
  /** Use when a resource already exists */
  ALREADY_EXISTS,
  /** Use for Exceptions thrown during aggregation */
  AGGREGATION_EXCEPTION,
  /** Use when given file does not meet requirements */
  INVALID_FILE,
  /** Use when given PDF file does not meet requirements */
  NONCONFORM_PDF,
  /** Use when headers of the uploaded csv file don´t match the template */
  CSV_INVALID_HEADER,
  /** Use when data was illegally manipulated */
  CORRUPT,
  /** Use when a resource is locked by another user */
  LOCKED,
  /** Use when a xlsx file has too many rows */
  XLSX_TOO_MANY_ROWS,
}

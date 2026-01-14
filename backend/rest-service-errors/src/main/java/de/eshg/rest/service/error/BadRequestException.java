/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import java.io.Serial;

public class BadRequestException extends EshgBusinessException {

  @Serial private static final long serialVersionUID = 1L;

  public BadRequestException(String clientVisibleMessage) {
    super(ErrorCode.BAD_REQUEST, clientVisibleMessage);
  }

  public BadRequestException(String clientVisibleMessage, String internalErrorMessage) {
    super(ErrorCode.BAD_REQUEST, clientVisibleMessage, internalErrorMessage);
  }

  public BadRequestException(ErrorCode errorCode, String clientVisibleMessage) {
    super(errorCode, clientVisibleMessage);
  }

  public BadRequestException(
      ErrorCode errorCode, String clientVisibleMessage, String internalErrorMessage) {
    super(errorCode, clientVisibleMessage, internalErrorMessage);
  }
}

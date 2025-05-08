/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import java.io.Serial;

public abstract class EshgBusinessException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  private final ErrorCode errorCode;
  private final String clientVisibleMessage;

  protected EshgBusinessException(ErrorCode errorCode, String clientVisibleMessage) {
    this(errorCode, clientVisibleMessage, clientVisibleMessage);
  }

  protected EshgBusinessException(
      ErrorCode errorCode, String clientVisibleMessage, String internalErrorMessage) {
    super(internalErrorMessage);
    this.errorCode = errorCode;
    this.clientVisibleMessage = clientVisibleMessage;
  }

  public ErrorCode getErrorCode() {
    return errorCode;
  }

  public String getClientVisibleMessage() {
    return clientVisibleMessage;
  }
}

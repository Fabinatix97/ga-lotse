/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import java.io.Serial;

public class InternalServerErrorException extends EshgBusinessException {
  @Serial private static final long serialVersionUID = 1L;

  public InternalServerErrorException(String clientVisibleMessage) {
    super(ErrorCode.INTERNAL_SERVER_ERROR, clientVisibleMessage);
  }

  public InternalServerErrorException(String clientVisibleMessage, String internalErrorMessage) {
    super(ErrorCode.INTERNAL_SERVER_ERROR, clientVisibleMessage, internalErrorMessage);
  }
}

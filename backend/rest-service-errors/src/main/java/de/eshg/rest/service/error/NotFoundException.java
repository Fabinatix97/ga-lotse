/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import java.io.Serial;

public class NotFoundException extends EshgBusinessException {

  @Serial private static final long serialVersionUID = 1L;

  public NotFoundException(String clientVisibleMessage) {
    super(ErrorCode.NOT_FOUND, clientVisibleMessage);
  }

  public NotFoundException(String clientVisibleMessage, String internalErrorMessage) {
    super(ErrorCode.NOT_FOUND, clientVisibleMessage, internalErrorMessage);
  }
}

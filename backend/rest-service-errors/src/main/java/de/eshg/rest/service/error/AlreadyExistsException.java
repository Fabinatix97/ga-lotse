/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import java.io.Serial;

public class AlreadyExistsException extends EshgBusinessException {

  @Serial private static final long serialVersionUID = 1L;

  public AlreadyExistsException(String clientVisibleMessage) {
    super(ErrorCode.ALREADY_EXISTS, clientVisibleMessage);
  }

  public AlreadyExistsException(String clientVisibleMessage, String internalErrorMessage) {
    super(ErrorCode.ALREADY_EXISTS, clientVisibleMessage, internalErrorMessage);
  }
}

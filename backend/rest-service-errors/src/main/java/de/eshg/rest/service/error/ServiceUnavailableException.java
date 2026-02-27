/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import java.io.Serial;

public class ServiceUnavailableException extends EshgBusinessException {

  @Serial private static final long serialVersionUID = 1L;

  public ServiceUnavailableException(String clientVisibleMessage) {
    super(ErrorCode.SERVICE_UNAVAILABLE, clientVisibleMessage);
  }

  public ServiceUnavailableException(String clientVisibleMessage, String internalErrorMessage) {
    super(ErrorCode.SERVICE_UNAVAILABLE, clientVisibleMessage, internalErrorMessage);
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import java.io.Serial;

public class AggregationException extends EshgBusinessException {

  @Serial private static final long serialVersionUID = 1L;

  public AggregationException(String clientVisibleMessage) {
    super(ErrorCode.AGGREGATION_EXCEPTION, clientVisibleMessage);
  }

  public AggregationException(String clientVisibleMessage, String internalErrorMessage) {
    super(ErrorCode.AGGREGATION_EXCEPTION, clientVisibleMessage, internalErrorMessage);
  }

  public AggregationException(ErrorCode errorCode, String clientVisibleMessage) {
    super(errorCode, clientVisibleMessage);
  }

  public AggregationException(
      ErrorCode errorCode, String clientVisibleMessage, String internalErrorMessage) {
    super(errorCode, clientVisibleMessage, internalErrorMessage);
  }
}

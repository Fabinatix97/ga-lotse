/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AbstractBaseModuleAggregationHelper<B extends AbstractBaseModuleClient>
    extends AggregationHelper {

  private static final Logger log =
      LoggerFactory.getLogger(AbstractBaseModuleAggregationHelper.class);

  protected abstract List<B> getBaseModuleClients();

  @Override
  protected ErrorResponseWithLocation createErrorResponse(
      ErrorCode errorCode, String healthDepartmentName, ExecutionException e) {
    String message = "Error retrieving data from health department";
    if (errorCode.equals(ErrorCode.TIMEOUT)) {
      message = "Timeout from health department";
    }
    if (errorCode.equals(ErrorCode.INSUFFICIENT_USER_RIGHTS)) {
      message = "Insufficient user rights";
    }

    log.error(message, e);
    return new ErrorResponseWithLocation(errorCode, message, healthDepartmentName);
  }

  public <T> List<ClientResponse<T>> requestFromBaseModules(Function<B, T> getFromBaseModule) {
    return requestFromClients(getBaseModuleClients(), getFromBaseModule);
  }
}

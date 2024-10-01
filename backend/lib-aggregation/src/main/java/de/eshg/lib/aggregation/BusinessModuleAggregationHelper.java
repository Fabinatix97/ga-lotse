/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import de.eshg.rest.service.error.NotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class BusinessModuleAggregationHelper extends AggregationHelper {

  private static final Logger log = LoggerFactory.getLogger(BusinessModuleAggregationHelper.class);

  private final BusinessModuleClientRegistry businessModuleClientRegistry;

  public BusinessModuleAggregationHelper(
      BusinessModuleClientRegistry businessModuleClientRegistry) {
    this.businessModuleClientRegistry = businessModuleClientRegistry;
  }

  @Override
  protected Logger logger() {
    return log;
  }

  @Override
  protected ErrorResponseWithLocation createErrorResponse(
      ErrorCode errorCode, String businessModuleName, ExecutionException e) {

    String message =
        switch (errorCode) {
          case TIMEOUT -> "Timeout for business module: " + businessModuleName;
          case INSUFFICIENT_USER_RIGHTS ->
              "Insufficient user rights for business module: " + businessModuleName;
          case UNAUTHORIZED -> "Unauthorized access for business module: " + businessModuleName;
          default -> "Error retrieving data from business module: " + businessModuleName;
        };

    return new ErrorResponseWithLocation(errorCode, message, businessModuleName);
  }

  public static <T> boolean bySetContainingValue(
      Set<T> filteringValues, Supplier<T> valueSupplier) {
    if (CollectionUtils.isEmpty(filteringValues)) {
      return true;
    }

    return filteringValues.contains(valueSupplier.get());
  }

  public void validateBusinessModuleIsRegistered(String businessModule) {
    Optional<BusinessModuleClient> businessModuleClientOptional =
        businessModuleClientRegistry.getBusinessModuleClients().stream()
            .filter(
                businessModuleClient -> businessModuleClient.getLocation().equals(businessModule))
            .findFirst();

    if (businessModuleClientOptional.isEmpty()) {
      throw new NotFoundException("BusinessModule '%s' not registered".formatted(businessModule));
    }
  }

  public <T> List<ClientResponse<T>> requestFromBusinessModulesClients(
      Set<String> businessModules, Function<BusinessModuleClient, T> getFromBusinessModule) {
    List<BusinessModuleClient> businessModuleClients =
        businessModuleClientRegistry.getBusinessModuleClients().stream()
            .filter(client -> bySetContainingValue(businessModules, client::getLocation))
            .toList();
    return requestFromClients(businessModuleClients, getFromBusinessModule);
  }

  public <T> List<ClientResponse<T>> requestFromBusinessModules(
      Set<BusinessModule> businessModules,
      Function<BusinessModuleClient, T> getFromBusinessModule) {
    Set<String> businessModuleNames =
        businessModules == null
            ? null
            : businessModules.stream().map(Enum::name).collect(Collectors.toSet());
    return requestFromBusinessModulesClients(businessModuleNames, getFromBusinessModule);
  }
}

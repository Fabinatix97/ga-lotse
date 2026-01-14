/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.common.BusinessModuleCapability;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import de.eshg.rest.service.error.NotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
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
      ErrorCode errorCode, BusinessModule businessModule, ExecutionException e) {

    String message =
        switch (errorCode) {
          case TIMEOUT -> "Timeout for business module: " + businessModule;
          case INSUFFICIENT_USER_RIGHTS ->
              "Insufficient user rights for business module: " + businessModule;
          case UNAUTHORIZED -> "Unauthorized access for business module: " + businessModule;
          default -> "Error retrieving data from business module: " + businessModule;
        };

    return new ErrorResponseWithLocation(errorCode, message, businessModule.name());
  }

  public static <T> boolean bySetContainingValue(
      Set<T> filteringValues, Supplier<T> valueSupplier) {
    if (CollectionUtils.isEmpty(filteringValues)) {
      return true;
    }

    return filteringValues.contains(valueSupplier.get());
  }

  public void validateBusinessModuleIsRegistered(String businessModuleName) {
    Optional<BusinessModuleClient> businessModuleClientOptional =
        businessModuleClientRegistry.getBusinessModuleClients().stream()
            .filter(
                businessModuleClient ->
                    businessModuleClient.getBusinessModule().name().equals(businessModuleName))
            .findFirst();

    if (businessModuleClientOptional.isEmpty()) {
      throw new NotFoundException(
          "BusinessModule '%s' not registered".formatted(businessModuleName));
    }
  }

  public <T> List<ClientResponse<T>> requestFromBusinessModulesClients(
      Set<String> businessModuleNamesFilter,
      BusinessModuleCapability businessModuleCapabilityFilter,
      Function<BusinessModuleClient, T> getFromBusinessModule) {
    List<BusinessModuleClient> businessModuleClients =
        businessModuleClientRegistry.getBusinessModuleClients().stream()
            .filter(nameFilter(businessModuleNamesFilter))
            .filter(capabilityFilter(businessModuleCapabilityFilter))
            .toList();
    return requestFromClients(businessModuleClients, getFromBusinessModule);
  }

  private static Predicate<BusinessModuleClient> capabilityFilter(
      BusinessModuleCapability businessModuleCapability) {
    return client ->
        businessModuleCapability == null
            || client.getBusinessModule().hasCapability(businessModuleCapability);
  }

  private static Predicate<BusinessModuleClient> nameFilter(Set<String> businessModuleNames) {
    if (CollectionUtils.isEmpty(businessModuleNames)) {
      return client -> true;
    }
    return client -> businessModuleNames.contains(client.getBusinessModule().name());
  }

  public <T> List<ClientResponse<T>> requestFromBusinessModules(
      Set<BusinessModule> businessModulesFilter,
      BusinessModuleCapability businessModuleCapabilityFilter,
      Function<BusinessModuleClient, T> getFromBusinessModule) {
    Set<String> businessModuleNames =
        businessModulesFilter == null
            ? null
            : businessModulesFilter.stream().map(Enum::name).collect(StreamUtil.toLinkedHashSet());
    return requestFromBusinessModulesClients(
        businessModuleNames, businessModuleCapabilityFilter, getFromBusinessModule);
  }
}

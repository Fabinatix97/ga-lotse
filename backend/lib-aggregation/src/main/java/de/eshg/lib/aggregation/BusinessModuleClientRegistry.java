/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import static java.util.function.Predicate.not;

import de.eshg.lib.aggregation.spring.BusinessModulesConfigurationProperties;
import de.eshg.lib.common.BusinessModule;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.InvalidPropertyException;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient.Builder;

@Component
public class BusinessModuleClientRegistry {

  private static final Logger log = LoggerFactory.getLogger(BusinessModuleClientRegistry.class);
  private static final Set<String> AVAILABLE_BUSINESS_MODULES =
      EnumSet.allOf(BusinessModule.class).stream().map(Enum::name).collect(Collectors.toSet());

  private List<BusinessModuleClient> businessModuleClients;

  public BusinessModuleClientRegistry(
      BusinessModulesConfigurationProperties configurationProperties,
      Builder restClientBuilder,
      ConversionService conversionService) {

    businessModuleClients =
        configurationProperties.getClients().stream()
            .map(
                clientProperties ->
                    new BusinessModuleClient(
                        clientProperties, restClientBuilder, conversionService))
            .toList();

    validateBusinessModuleNames();
    validateNoDuplicateBusinessModuleNames();

    businessModuleClients.forEach(
        client ->
            log.info(
                "created business module client {} on {}", client.getLocation(), client.getUrl()));
  }

  private void validateBusinessModuleNames() {
    List<String> invalidBusinessModules =
        businessModuleClients.stream()
            .map(ClientWithLocationAndTimeout::getLocation)
            .filter(not(AVAILABLE_BUSINESS_MODULES::contains))
            .toList();

    if (!invalidBusinessModules.isEmpty()) {
      throw new IllegalArgumentException(
          "Unknown business module names configured: %s"
              .formatted(String.join(",", invalidBusinessModules)));
    }
  }

  private void validateNoDuplicateBusinessModuleNames() {
    Set<String> presentNames = new HashSet<>();
    boolean notUnique =
        businessModuleClients.stream().anyMatch(client -> !presentNames.add(client.getLocation()));
    if (notUnique) {
      throw new InvalidPropertyException(
          BusinessModulesConfigurationProperties.class,
          "de.eshg.business-modules.clients[...].type",
          "Clients configured with duplicate types");
    }
  }

  public List<BusinessModuleClient> getBusinessModuleClients() {
    return businessModuleClients;
  }

  private void setBusinessModuleClients(List<BusinessModuleClient> businessModuleClients) {
    this.businessModuleClients = businessModuleClients;
  }

  public final void setBusinessModuleClients(BusinessModuleClient... businessModuleClients) {
    setBusinessModuleClients(Arrays.asList(businessModuleClients));
  }
}

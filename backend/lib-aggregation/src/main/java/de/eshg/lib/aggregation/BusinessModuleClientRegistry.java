/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.eshg.lib.aggregation.spring.BusinessModulesConfigurationProperties;
import java.util.Arrays;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient.Builder;

@Component
public class BusinessModuleClientRegistry {

  private static final Logger log = LoggerFactory.getLogger(BusinessModuleClientRegistry.class);

  private List<BusinessModuleClient> businessModuleClients;

  public BusinessModuleClientRegistry(
      BusinessModulesConfigurationProperties configurationProperties,
      Builder restClientBuilder,
      ConversionService conversionService) {

    businessModuleClients =
        configurationProperties.clients().entrySet().stream()
            .map(
                entry ->
                    new BusinessModuleClient(
                        entry.getKey(), entry.getValue(), restClientBuilder, conversionService))
            .toList();

    businessModuleClients.forEach(
        client ->
            log.info(
                "Created business module client {} on {}",
                client.getBusinessModule(),
                client.getUrl()));
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

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.aggregation.spring.BusinessModulesConfigurationProperties;
import de.eshg.lib.common.BusinessModule;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient.Builder;

@Component
public class BusinessModuleClientRegistry {

  private static final Logger log = LoggerFactory.getLogger(BusinessModuleClientRegistry.class);

  private final Map<BusinessModule, BusinessModuleClient> businessModuleClients;
  private final BusinessModulesConfigurationProperties businessModulesConfigurationProperties;

  public BusinessModuleClientRegistry(
      BusinessModulesConfigurationProperties businessModulesConfigurationProperties,
      Builder restClientBuilder,
      ConversionService conversionService) {
    this.businessModuleClients =
        businessModulesConfigurationProperties.getClients().entrySet().stream()
            .map(entry -> createBusinessModuleClient(restClientBuilder, conversionService, entry))
            .collect(StreamUtil.toLinkedHashMap(BusinessModuleClient::getBusinessModule));
    this.businessModulesConfigurationProperties = businessModulesConfigurationProperties;
  }

  private static BusinessModuleClient createBusinessModuleClient(
      Builder restClientBuilder,
      ConversionService conversionService,
      Map.Entry<
              BusinessModule, BusinessModulesConfigurationProperties.BusinessModuleClientProperties>
          entry) {
    BusinessModuleClient client =
        new BusinessModuleClient(
            entry.getKey(), entry.getValue(), restClientBuilder, conversionService);
    log.info(
        "Created business module client {} on {}", client.getBusinessModule(), client.getUrl());
    return client;
  }

  public List<BusinessModuleClient> getBusinessModuleClients() {
    // Note: For testing, individual business modules can be removed via the Test Helper.
    // Active modules are managed via BusinessModulesConfigurationProperties.
    return businessModulesConfigurationProperties.getClients().keySet().stream()
        .map(businessModuleClients::get)
        .toList();
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.api.GetConfigurationResponse;
import de.eshg.lib.aggregation.BusinessModuleClient;
import de.eshg.lib.aggregation.BusinessModuleClientRegistry;
import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.unit.DataSize;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "PublicConfig")
public class PublicConfigController implements PublicConfigApi {

  @Value("${spring.servlet.multipart.max-file-size}")
  private DataSize maxFileSize;

  private final BusinessModuleClientRegistry businessModuleClientRegistry;
  private final BaseConfigurationProperties baseConfigurationProperties;

  public PublicConfigController(
      BusinessModuleClientRegistry businessModuleClientRegistry,
      BaseConfigurationProperties baseConfigurationProperties) {
    this.businessModuleClientRegistry = businessModuleClientRegistry;
    this.baseConfigurationProperties = baseConfigurationProperties;
  }

  @Override
  public GetConfigurationResponse getConfig() {
    return new GetConfigurationResponse(
        maxFileSize.toBytes(),
        getRegisteredBusinessModules(),
        baseConfigurationProperties.isOpenDataEnabled());
  }

  private List<BusinessModule> getRegisteredBusinessModules() {
    return businessModuleClientRegistry.getBusinessModuleClients().stream()
        .map(BusinessModuleClient::getBusinessModule)
        .toList();
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation.spring;

import de.eshg.lib.common.BusinessModule;
import de.eshg.testhelper.ResettableProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.business-modules")
public class BusinessModulesConfigurationProperties implements ResettableProperties {

  @Valid
  private Map<BusinessModule, BusinessModuleClientProperties> clients = new LinkedHashMap<>();

  public Map<BusinessModule, BusinessModuleClientProperties> getClients() {
    return clients;
  }

  public void setClients(Map<BusinessModule, BusinessModuleClientProperties> clients) {
    this.clients = clients;
  }

  public record BusinessModuleClientProperties(
      @NotNull URI url, @DefaultValue("PT10s") Duration clientTimeout) {
    public BusinessModuleClientProperties {
      if (!clientTimeout.isPositive()) {
        throw new IllegalArgumentException("Illegal client timeout: " + clientTimeout);
      }
    }
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation.spring;

import de.eshg.lib.common.BusinessModule;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.util.Map;
import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.business-modules")
public record BusinessModulesConfigurationProperties(
    @Valid @DefaultValue Map<BusinessModule, BusinessModuleClientProperties> clients) {

  public record BusinessModuleClientProperties(
      @URL @NotNull String url, @DefaultValue("PT10s") Duration clientTimeout) {
    public BusinessModuleClientProperties {
      if (!clientTimeout.isPositive()) {
        throw new IllegalArgumentException("Illegal client timeout: " + clientTimeout);
      }
    }
  }
}

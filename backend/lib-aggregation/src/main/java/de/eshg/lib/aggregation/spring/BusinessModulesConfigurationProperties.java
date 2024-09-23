/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation.spring;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.business-modules")
public class BusinessModulesConfigurationProperties {

  private List<BusinessModuleClientProperties> clients = Collections.emptyList();

  public List<BusinessModuleClientProperties> getClients() {
    return clients;
  }

  public void setClients(List<BusinessModuleClientProperties> clients) {
    this.clients = clients;
  }

  public static class BusinessModuleClientProperties {

    private static final Duration DEFAULT_CLIENT_TIMEOUT = Duration.ofSeconds(10);

    @URL @NotNull private String url;

    @NotBlank private String type;

    @NotNull private Duration clientTimeout = DEFAULT_CLIENT_TIMEOUT;

    public String getUrl() {
      return url;
    }

    public void setUrl(String url) {
      this.url = url;
    }

    public String getType() {
      return type;
    }

    public void setType(String type) {
      this.type = type;
    }

    public Duration getClientTimeout() {
      return clientTimeout;
    }

    public void setClientTimeout(Duration clientTimeout) {
      if (!clientTimeout.isPositive()) {
        throw new IllegalArgumentException("Illegal client timeout: " + clientTimeout);
      }
      this.clientTimeout = clientTimeout;
    }
  }
}

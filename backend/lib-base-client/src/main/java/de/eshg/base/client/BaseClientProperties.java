/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.client;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.base")
public class BaseClientProperties {

  private final String serviceUrl;

  public BaseClientProperties(String serviceUrl) {
    this.serviceUrl = serviceUrl;
  }

  public String getServiceUrl() {
    return serviceUrl;
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.client;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.file-jockey")
public class FileJockeyClientProperties {

  private final String serviceUrl;

  public FileJockeyClientProperties(String serviceUrl) {
    this.serviceUrl = serviceUrl;
  }

  public String getServiceUrl() {
    return serviceUrl;
  }
}

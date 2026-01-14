/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.client;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.schoolentry")
public class SchoolEntryClientProperties {

  private final String serviceUrl;

  public SchoolEntryClientProperties(String serviceUrl) {
    this.serviceUrl = serviceUrl;
  }

  public String getServiceUrl() {
    return serviceUrl;
  }
}

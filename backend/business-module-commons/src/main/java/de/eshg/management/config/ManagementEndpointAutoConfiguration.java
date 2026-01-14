/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.management.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@PropertySource("classpath:/management-endpoints.properties")
public class ManagementEndpointAutoConfiguration {

  private static final Logger log =
      LoggerFactory.getLogger(ManagementEndpointAutoConfiguration.class);

  private ManagementEndpointAutoConfiguration() {
    log.info("Applying default management endpoint configuration");
  }
}

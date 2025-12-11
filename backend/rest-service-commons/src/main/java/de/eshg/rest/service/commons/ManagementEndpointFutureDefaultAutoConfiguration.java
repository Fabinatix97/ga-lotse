/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@PropertySource("classpath:/management-endpoints-future-default.properties")
public class ManagementEndpointFutureDefaultAutoConfiguration {

  private static final Logger log =
      LoggerFactory.getLogger(ManagementEndpointFutureDefaultAutoConfiguration.class);

  private ManagementEndpointFutureDefaultAutoConfiguration() {
    log.info("Applying Spring Boot 4 default management endpoint configuration");
  }
}

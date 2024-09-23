/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@PropertySource("classpath:/server-common.properties")
public class ServerAutoConfiguration {

  private static final Logger log = LoggerFactory.getLogger(ServerAutoConfiguration.class);

  private ServerAutoConfiguration() {
    log.info("Applying default server configuration");
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@ConditionalOnLocalEnvironment
@PropertySource("classpath:/common-local.properties")
public class LocalProfileAutoConfiguration {

  private static final Logger log = LoggerFactory.getLogger(LocalProfileAutoConfiguration.class);

  LocalProfileAutoConfiguration() {
    log.info("{} is active", this);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
public class ProfileAutoConfiguration {

  private static final Logger log = LoggerFactory.getLogger(ProfileAutoConfiguration.class);

  @Configuration
  @ConditionalOnLocalEnvironment
  @PropertySource("classpath:/common-local.properties")
  static class LocalProfileConfig {
    LocalProfileConfig() {
      log.info("{} is active", this);
    }
  }

  @Configuration
  @ConditionalOnDevEnvironment
  @PropertySource("classpath:/common-dev.properties")
  static class DevProfileConfig {
    DevProfileConfig() {
      log.info("{} is active", this);
    }
  }

  @Configuration
  @ConditionalOnProdEnvironment
  @PropertySource("classpath:/common-production.properties")
  static class ProdProfileConfig {
    ProdProfileConfig() {
      log.info("{} is active", this);
    }
  }
}

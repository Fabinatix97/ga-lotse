/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons;

import java.time.Clock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
public class ClockAutoConfiguration {

  private static final Logger log = LoggerFactory.getLogger(ClockAutoConfiguration.class);

  @Bean
  @ConditionalOnMissingBean
  public Clock clock() {
    Clock clock = Clock.systemDefaultZone();
    log.info("Using system clock in timezone {}", clock.getZone());
    return clock;
  }
}

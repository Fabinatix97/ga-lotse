/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.validation;

import jakarta.validation.ClockProvider;
import jakarta.validation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.validation.ValidationConfigurationCustomizer;
import org.springframework.stereotype.Component;

@Component
public class ConfigurationCustomizer implements ValidationConfigurationCustomizer {

  private static final Logger log = LoggerFactory.getLogger(ConfigurationCustomizer.class);

  private final ClockProvider clockProvider;

  public ConfigurationCustomizer(ClockProvider clockProvider) {
    this.clockProvider = clockProvider;
  }

  @Override
  public void customize(Configuration<?> configuration) {
    log.trace("Setting custom ClockProvider {}", clockProvider);
    configuration.clockProvider(clockProvider);
  }
}

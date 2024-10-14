/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.environment;

import jakarta.validation.constraints.NotNull;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("eshg")
public record EnvironmentConfig(@NotNull EnvironmentType environmentType) {

  private static final Logger log = LoggerFactory.getLogger(EnvironmentConfig.class);

  public EnvironmentConfig {
    log.info("Environment: {}", environmentType);
  }

  public void assertIsNotProduction() {
    Assert.isTrue(
        !Objects.equals(environmentType(), EnvironmentType.PRODUCTION),
        "Non-production environment required!");
  }
}

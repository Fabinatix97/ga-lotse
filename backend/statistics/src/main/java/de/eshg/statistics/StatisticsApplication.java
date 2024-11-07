/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.rest.service.security.config.StatisticsPublicSecurityConfig;
import de.eshg.statistics.config.OriginalDataAccessConfig;
import de.eshg.statistics.config.StatisticsFeatureToggle;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(StatisticsPublicSecurityConfig.class)
@EnableConfigurationProperties({StatisticsFeatureToggle.class, OriginalDataAccessConfig.class})
public class StatisticsApplication {

  public static final String MODULE_NAME = "Statistikmodul";

  public static void main(String[] args) {
    SpringApplication.run(StatisticsApplication.class, args);
  }
}

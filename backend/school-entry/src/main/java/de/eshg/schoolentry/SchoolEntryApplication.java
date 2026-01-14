/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.SchoolEntryPublicSecurityConfig;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(SchoolEntryPublicSecurityConfig.class)
@EnableConfigurationProperties({SchoolEntryProperties.class, SchoolEntryFeatureToggle.class})
public class SchoolEntryApplication {

  @Bean
  BusinessModule businessModule() {
    return BusinessModule.SCHOOL_ENTRY;
  }

  public static void main(String[] args) {
    SpringApplication.run(SchoolEntryApplication.class, args);
  }
}

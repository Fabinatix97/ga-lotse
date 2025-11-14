/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.lib.common.BusinessModule;
import de.eshg.measlesprotection.config.MeaslesProtectionFeatureToggle;
import de.eshg.rest.service.security.config.MeaslesProtectionPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(MeaslesProtectionPublicSecurityConfig.class)
@EnableConfigurationProperties({
  MeaslesProtectionFeatureToggle.class,
  MeaslesProtectionProperties.class
})
public class MeaslesProtectionApplication {

  @Bean
  BusinessModule businessModule() {
    return BusinessModule.MEASLES_PROTECTION;
  }

  public static void main(String[] args) {
    SpringApplication.run(MeaslesProtectionApplication.class, args);
  }
}

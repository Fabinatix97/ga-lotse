/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.dental.config.DentalProperties;
import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.DentalPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(DentalPublicSecurityConfig.class)
@EnableConfigurationProperties({DentalProperties.class})
public class DentalApplication {

  @Bean
  BusinessModule businessModule() {
    return BusinessModule.DENTAL;
  }

  public static void main(String[] args) {
    SpringApplication.run(DentalApplication.class, args);
  }
}

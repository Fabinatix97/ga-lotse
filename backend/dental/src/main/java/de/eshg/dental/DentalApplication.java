/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.DentalPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(DentalPublicSecurityConfig.class)
public class DentalApplication {

  @Bean
  BusinessModule businessModule() {
    return BusinessModule.DENTAL;
  }

  public static void main(String[] args) {
    SpringApplication.run(DentalApplication.class, args);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.MedsAbroadPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(MedsAbroadPublicSecurityConfig.class)
public class MedsAbroadApplication {
  @Bean
  BusinessModule businessModule() {
    return BusinessModule.MEDS_ABROAD;
  }

  public static void main(String[] args) {
    SpringApplication.run(MedsAbroadApplication.class, args);
  }
}

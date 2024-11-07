/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.StiProtectionPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(StiProtectionPublicSecurityConfig.class)
@EntityScan("de.eshg")
public class StiProtectionApplication {

  @Bean
  BusinessModule businessModule() {
    return BusinessModule.STI_PROTECTION;
  }

  public static void main(String[] args) {
    SpringApplication.run(StiProtectionApplication.class, args);
  }
}

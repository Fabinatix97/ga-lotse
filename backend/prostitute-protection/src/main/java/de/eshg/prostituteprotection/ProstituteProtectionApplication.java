/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.ProstituteProtectionPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(ProstituteProtectionPublicSecurityConfig.class)
public class ProstituteProtectionApplication {
  @Bean
  BusinessModule businessModule() {
    return BusinessModule.PROSTITUTE_PROTECTION;
  }

  public static void main(String[] args) {
    SpringApplication.run(ProstituteProtectionApplication.class, args);
  }
}

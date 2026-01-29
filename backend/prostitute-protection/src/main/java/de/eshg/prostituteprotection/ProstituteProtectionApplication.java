/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.lib.common.BusinessModule;
import de.eshg.prostituteprotection.config.InitialProstituteProtectionConfiguration;
import de.eshg.prostituteprotection.config.ProstituteProtectionProperties;
import de.eshg.rest.service.security.config.ProstituteProtectionPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(ProstituteProtectionPublicSecurityConfig.class)
@EnableConfigurationProperties({
  InitialProstituteProtectionConfiguration.class,
  ProstituteProtectionProperties.class
})
public class ProstituteProtectionApplication {
  @Bean
  BusinessModule businessModule() {
    return BusinessModule.PROSTITUTE_PROTECTION;
  }

  public static void main(String[] args) {
    SpringApplication.run(ProstituteProtectionApplication.class, args);
  }
}

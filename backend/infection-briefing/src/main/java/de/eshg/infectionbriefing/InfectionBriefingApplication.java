/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.eshg.infectionbriefing.config.InfectionBriefingProperties;
import de.eshg.infectionbriefing.config.InitialInfectionBriefingConfiguration;
import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.InfectionBriefingPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(InfectionBriefingPublicSecurityConfig.class)
@EnableConfigurationProperties({
  InfectionBriefingProperties.class,
  InitialInfectionBriefingConfiguration.class
})
public class InfectionBriefingApplication {
  @Bean
  BusinessModule businessModule() {
    return BusinessModule.INFECTION_BRIEFING;
  }

  public static void main(String[] args) {
    SpringApplication.run(InfectionBriefingApplication.class, args);
  }
}

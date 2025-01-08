/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.InspectionPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@ConfigurationPropertiesScan
@Import(InspectionPublicSecurityConfig.class)
public class InspectionApplication {

  @Bean
  public BusinessModule businessModule() {
    return BusinessModule.INSPECTION;
  }

  public static void main(String[] args) {
    SpringApplication.run(InspectionApplication.class, args);
  }
}

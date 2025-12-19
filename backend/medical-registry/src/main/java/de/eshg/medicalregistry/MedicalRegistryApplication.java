/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry;

import de.eshg.lib.common.BusinessModule;
import de.eshg.medicalregistry.config.MedicalRegistryProperties;
import de.eshg.medicalregistry.featuretoggle.MedicalRegistryFeatureToggle;
import de.eshg.rest.service.security.config.MedicalRegistryPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(MedicalRegistryPublicSecurityConfig.class)
@EnableConfigurationProperties({
  MedicalRegistryProperties.class,
  MedicalRegistryFeatureToggle.class
})
public class MedicalRegistryApplication {

  @Bean
  BusinessModule businessModule() {
    return BusinessModule.MEDICAL_REGISTRY;
  }

  public static void main(String[] args) {
    SpringApplication.run(MedicalRegistryApplication.class, args);
  }
}

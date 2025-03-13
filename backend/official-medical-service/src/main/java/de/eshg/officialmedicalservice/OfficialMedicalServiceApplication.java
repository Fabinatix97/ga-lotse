/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.OfficialMedicalServicePublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(OfficialMedicalServicePublicSecurityConfig.class)
public class OfficialMedicalServiceApplication {

  @Bean
  BusinessModule businessModule() {
    return BusinessModule.OFFICIAL_MEDICAL_SERVICE;
  }

  public static void main(String[] args) {
    SpringApplication.run(OfficialMedicalServiceApplication.class, args);
  }
}

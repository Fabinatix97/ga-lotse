/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.config;

import de.eshg.auditlog.AuditLogSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MedicalRegistryAuditLogConfiguration {

  @Bean
  AuditLogSource auditLogSource() {
    return AuditLogSource.MEDICAL_REGISTRY;
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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

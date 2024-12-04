/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice;

import de.eshg.auditlog.AuditLogSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OmsAuditLogConfiguration {

  @Bean
  public AuditLogSource auditLogSource() {
    return AuditLogSource.OFFICIAL_MEDICAL_SERVICE;
  }
}

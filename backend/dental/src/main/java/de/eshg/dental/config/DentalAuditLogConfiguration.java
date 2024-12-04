/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.config;

import de.eshg.auditlog.AuditLogSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DentalAuditLogConfiguration {

  @Bean
  public AuditLogSource auditLogSource() {
    return AuditLogSource.DENTAL;
  }
}

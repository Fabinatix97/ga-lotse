/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.auditlog.AuditLogSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenDataAuditLogConfiguration {

  @Bean
  AuditLogSource auditLogSource() {
    return AuditLogSource.OPENDATA;
  }
}

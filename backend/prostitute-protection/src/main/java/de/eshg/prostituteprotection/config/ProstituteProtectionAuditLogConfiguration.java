/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.config;

import de.eshg.auditlog.AuditLogSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class ProstituteProtectionAuditLogConfiguration {

  @Bean
  public AuditLogSource auditLogSource() {
    return AuditLogSource.PROSTITUTE_PROTECTION;
  }
}

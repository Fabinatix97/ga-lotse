/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableConfigurationProperties(AuditLogServiceConfig.class)
public class AuditLogApplication {

  @Bean
  public AuditLogSource auditLogSource() {
    return AuditLogSource.AUDITLOG;
  }

  public static void main(String[] args) {
    SpringApplication.run(AuditLogApplication.class, args);
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import de.eshg.auditlog.feature.AuditLogFeatureToggle;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableConfigurationProperties({AuditLogServiceConfig.class, AuditLogFeatureToggle.class})
public class AuditLogApplication {

  @Bean
  public AuditLogSource auditLogSource() {
    return AuditLogSource.AUDITLOG;
  }

  public static void main(String[] args) {
    SpringApplication.run(AuditLogApplication.class, args);
  }
}

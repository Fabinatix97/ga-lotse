/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine;

import de.eshg.auditlog.AuditLogSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TravelMedicineAuditLogConfiguration {

  @Bean
  public AuditLogSource auditLogSource() {
    return AuditLogSource.TRAVEL_MEDICINE;
  }
}

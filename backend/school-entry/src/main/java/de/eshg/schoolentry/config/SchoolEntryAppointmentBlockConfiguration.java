/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.config;

import de.eshg.lib.appointmentblock.AppointmentBlockValidator;
import de.eshg.lib.keycloak.TechnicalGroup;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SchoolEntryAppointmentBlockConfiguration {

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_PHYSICIANS)
  TechnicalGroup technicalGroupPhysicians() {
    return TechnicalGroup.SCHOOL_ENTRY_PHYSICIAN;
  }

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_MFAS)
  TechnicalGroup technicalGroupMfas() {
    return TechnicalGroup.SCHOOL_ENTRY_MFA;
  }
}

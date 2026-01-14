/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import de.eshg.lib.appointmentblock.AppointmentBlockValidator;
import de.eshg.lib.keycloak.TechnicalGroup;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StiProtectionAppointmentBlockConfiguration {

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_PHYSICIANS)
  TechnicalGroup technicalGroupPhysicians() {
    return TechnicalGroup.STI_PROTECTION_PHYSICIAN;
  }

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_MFAS)
  TechnicalGroup technicalGroupMfas() {
    return TechnicalGroup.STI_PROTECTION_MFA;
  }

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_CONSULTANTS)
  TechnicalGroup technicalGroupConsultants() {
    return TechnicalGroup.STI_PROTECTION_CONSULTANT;
  }
}

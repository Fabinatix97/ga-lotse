/*
 * Copyright 2024 cronn GmbH
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
    return TechnicalGroup.STI_PROTECTION_PHYSICIANS;
  }

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_MFAS)
  TechnicalGroup technicalGroupMfas() {
    return TechnicalGroup.STI_PROTECTION_MFAS;
  }

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_CONSULTANTS)
  TechnicalGroup technicalGroupConsultants() {
    return TechnicalGroup.STI_PROTECTION_CONSULTANTS;
  }
}

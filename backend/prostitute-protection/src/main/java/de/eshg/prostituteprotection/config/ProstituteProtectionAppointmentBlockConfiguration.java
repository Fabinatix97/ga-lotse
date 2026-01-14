/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.config;

import de.eshg.lib.appointmentblock.AppointmentBlockValidator;
import de.eshg.lib.keycloak.TechnicalGroup;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProstituteProtectionAppointmentBlockConfiguration {

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_CONSULTANTS)
  TechnicalGroup technicalGroupConsultants() {
    return TechnicalGroup.PROSTITUTE_PROTECTION_CONSULTANT;
  }
}

/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine;

import de.eshg.lib.appointmentblock.AppointmentBlockValidator;
import de.eshg.lib.keycloak.TechnicalGroup;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TravelMedicineAppointmentBlockConfiguration {

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_PHYSICIANS)
  TechnicalGroup technicalGroupPhysicians() {
    return TechnicalGroup.TRAVEL_MEDICINE_PHYSICIAN;
  }

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_MFAS)
  TechnicalGroup technicalGroupMfas() {
    return TechnicalGroup.TRAVEL_MEDICINE_MFA;
  }
}

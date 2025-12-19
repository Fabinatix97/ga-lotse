/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice;

import de.eshg.lib.appointmentblock.AppointmentBlockValidator;
import de.eshg.lib.keycloak.TechnicalGroup;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OmsAppointmentBlockConfiguration {

  @Bean(name = AppointmentBlockValidator.TECHNICAL_GROUP_PHYSICIANS)
  TechnicalGroup technicalGroupPhysicians() {
    return TechnicalGroup.OFFICIAL_MEDICAL_SERVICE_PHYSICIANS;
  }
}

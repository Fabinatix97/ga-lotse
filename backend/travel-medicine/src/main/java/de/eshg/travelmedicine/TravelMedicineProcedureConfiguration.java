/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine;

import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationTask;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TravelMedicineProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.TRAVEL_MEDICINE;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.TRAVEL_MEDICINE_LEADER;
  }

  @Bean
  SummaryProvider<VaccinationConsultationTask, VaccinationConsultation> summaryProvider() {
    return new SummaryProvider<>() {
      @Override
      public String getTaskSummary(VaccinationConsultationTask vaccinationConsultationTask) {
        return "Impfberatung";
      }

      @Override
      public String getProcedureSummary(VaccinationConsultation vaccinationConsultation) {
        return "Impfberatungsvorgang";
      }
    };
  }
}

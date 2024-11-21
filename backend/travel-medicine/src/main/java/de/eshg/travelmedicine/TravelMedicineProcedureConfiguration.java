/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationTask;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
      public Map<Long, String> getTaskSummaries(List<VaccinationConsultationTask> tasks) {
        return tasks.stream()
            .collect(Collectors.toMap(SequencedBaseEntity::getId, task -> "Impfberatung"));
      }

      @Override
      public Map<Long, String> getProcedureSummaries(List<VaccinationConsultation> procedures) {
        return procedures.stream()
            .collect(
                Collectors.toMap(SequencedBaseEntity::getId, procedure -> "Impfberatungsvorgang"));
      }
    };
  }
}

/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsTask;
import java.util.List;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OmsProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.OFFICIAL_MEDICAL_SERVICE;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.OFFICIAL_MEDICAL_SERVICE_LEADER;
  }

  @Bean
  SummaryProvider<OmsTask, OmsProcedure> summaryProvider() {
    return new SummaryProvider<>() {
      @Override
      public Map<Long, String> getTaskSummaries(List<OmsTask> tasks) {
        return tasks.stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    SequencedBaseEntity::getId, task -> "Amtsärztlicher Dienst"));
      }

      @Override
      public Map<Long, String> getProcedureSummaries(List<OmsProcedure> procedures) {
        return procedures.stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    SequencedBaseEntity::getId, procedure -> "Amtsärztlicher Dienst Vorgang"));
      }
    };
  }
}

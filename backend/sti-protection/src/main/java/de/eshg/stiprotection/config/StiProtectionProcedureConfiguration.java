/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionTask;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class StiProtectionProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.STI_PROTECTION;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.STI_PROTECTION_LEADER;
  }

  @Bean
  SummaryProvider<StiProtectionTask, StiProtectionProcedure> summaryProvider() {
    return new SummaryProvider<>() {
      @Override
      public Map<Long, String> getTaskSummaries(List<StiProtectionTask> tasks) {
        return tasks.stream()
            .collect(Collectors.toMap(SequencedBaseEntity::getId, task -> "HIV-STI-Schutz"));
      }

      @Override
      public Map<Long, String> getProcedureSummaries(List<StiProtectionProcedure> procedures) {
        return procedures.stream()
            .collect(Collectors.toMap(SequencedBaseEntity::getId, procedure -> "HIV-STI-Schutz"));
      }
    };
  }
}

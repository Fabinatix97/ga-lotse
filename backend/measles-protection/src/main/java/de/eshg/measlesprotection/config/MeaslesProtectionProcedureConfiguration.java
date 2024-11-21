/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.config;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionTask;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class MeaslesProtectionProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.MEASLES_PROTECTION;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.MEASLES_PROTECTION_LEADER;
  }

  @Bean
  SummaryProvider<MeaslesProtectionTask, MeaslesProtectionProcedure> summaryProvider() {
    return new SummaryProvider<>() {
      @Override
      public Map<Long, String> getTaskSummaries(List<MeaslesProtectionTask> tasks) {
        return tasks.stream()
            .collect(Collectors.toMap(SequencedBaseEntity::getId, task -> "Masernschutzimpfung"));
      }

      @Override
      public Map<Long, String> getProcedureSummaries(List<MeaslesProtectionProcedure> procedures) {
        return procedures.stream()
            .collect(
                Collectors.toMap(SequencedBaseEntity::getId, procedure -> "Masernschutzimpfung"));
      }
    };
  }
}

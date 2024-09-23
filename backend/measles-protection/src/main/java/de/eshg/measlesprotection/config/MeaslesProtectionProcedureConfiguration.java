/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.config;

import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionTask;
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
      public String getTaskSummary(MeaslesProtectionTask task) {
        return "Masernschutzimpfung";
      }

      @Override
      public String getProcedureSummary(MeaslesProtectionProcedure procedure) {
        return "Masernschutzimpfung";
      }
    };
  }
}

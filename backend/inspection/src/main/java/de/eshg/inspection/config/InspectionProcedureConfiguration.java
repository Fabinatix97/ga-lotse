/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config;

import de.eshg.inspection.inspection.InspectionMapper;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionTask;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InspectionProcedureConfiguration {
  private final InspectionMapper inspectionMapper;

  public InspectionProcedureConfiguration(InspectionMapper inspectionMapper) {
    this.inspectionMapper = inspectionMapper;
  }

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.INSPECTION;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.INSPECTION_LEADER;
  }

  @Bean
  SummaryProvider<InspectionTask, Inspection> summaryProvider() {
    return new SummaryProvider<>() {
      @Override
      public String getTaskSummary(InspectionTask task) {
        return inspectionMapper.getInspectionTaskSummary(task);
      }

      @Override
      public String getProcedureSummary(Inspection procedure) {
        return inspectionMapper.getInspectionTitle(procedure);
      }
    };
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.config;

import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SimpleSummaryProvider;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import de.eshg.medsabroad.persistence.database.MedsAbroadTask;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class MedsAbroadProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.MEDS_ABROAD;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.MEDS_ABROAD_LEADER;
  }

  @Bean
  SummaryProvider<MedsAbroadTask, MedsAbroadProcedure> summaryProvider() {
    return new SimpleSummaryProvider<>("Reisen mit Betäubungsmitteln");
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.config;

import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.ChildTask;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SimpleSummaryProvider;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DentalProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.DENTAL;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.DENTAL_LEADER;
  }

  @Bean
  SummaryProvider<ChildTask, Child> summaryProvider() {
    return new SimpleSummaryProvider<>("Zahnärztlicher Dienst");
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.config;

import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SimpleSummaryProvider;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionTask;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class ProstituteProtectionProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.PROSTITUTE_PROTECTION;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.PROSTITUTE_PROTECTION_LEADER;
  }

  @Bean
  SummaryProvider<ProstituteProtectionTask, ProstituteProtectionProcedure> summaryProvider() {
    return new SimpleSummaryProvider<>("Prostituiertenschutzgesetz");
  }
}

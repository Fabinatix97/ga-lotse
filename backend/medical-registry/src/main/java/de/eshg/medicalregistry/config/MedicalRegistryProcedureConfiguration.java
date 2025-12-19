/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.config;

import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SimpleSummaryProvider;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.MedicalRegistryTask;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MedicalRegistryProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.MEDICAL_REGISTRY;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.MEDICAL_REGISTRY_LEADER;
  }

  @Bean
  SummaryProvider<MedicalRegistryTask, MedicalRegistryProcedure> summaryProvider() {
    return new SimpleSummaryProvider<>("Medizinalaufsicht", "Medizinalaufsicht-Eintrag");
  }
}

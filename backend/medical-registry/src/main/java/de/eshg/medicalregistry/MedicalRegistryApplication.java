/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.auditlog.AuditLogSource;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryTask;
import de.eshg.rest.service.security.config.MedicalRegistryPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(MedicalRegistryPublicSecurityConfig.class)
public class MedicalRegistryApplication {

  @Bean
  BusinessModule businessModule() {
    return BusinessModule.MEDICAL_REGISTRY;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.MEDICAL_REGISTRY_LEADER;
  }

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.MEDICAL_REGISTRY;
  }

  @Bean
  SummaryProvider<MedicalRegistryTask, MedicalRegistryEntry> summaryProvider() {
    return new SummaryProvider<>() {
      @Override
      public String getTaskSummary(MedicalRegistryTask task) {
        return "";
      }

      @Override
      public String getProcedureSummary(MedicalRegistryEntry procedure) {
        return "";
      }
    };
  }

  @Bean
  AuditLogSource auditLogSource() {
    return AuditLogSource.MEDICAL_REGISTRY;
  }

  public static void main(String[] args) {
    SpringApplication.run(MedicalRegistryApplication.class, args);
  }
}

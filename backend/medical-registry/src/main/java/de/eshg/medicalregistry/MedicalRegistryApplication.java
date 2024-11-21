/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.auditlog.AuditLogSource;
import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import de.eshg.medicalregistry.config.MedicalRegistryProperties;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryTask;
import de.eshg.rest.service.security.config.MedicalRegistryPublicSecurityConfig;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(MedicalRegistryPublicSecurityConfig.class)
@EnableConfigurationProperties(MedicalRegistryProperties.class)
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
      public Map<Long, String> getTaskSummaries(List<MedicalRegistryTask> tasks) {
        return tasks.stream()
            .collect(Collectors.toMap(SequencedBaseEntity::getId, task -> "Medizinalaufsicht"));
      }

      @Override
      public Map<Long, String> getProcedureSummaries(List<MedicalRegistryEntry> procedures) {
        return procedures.stream()
            .collect(
                Collectors.toMap(
                    SequencedBaseEntity::getId, procedure -> "Medizinalaufsicht-Eintrag"));
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

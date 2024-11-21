/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config;

import static de.eshg.inspection.inspection.InspectionMapper.mapToInspectionTitle;
import static de.eshg.inspection.inspection.InspectionMapper.mapToTaskSummary;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.inspection.common.persistence.MediaFileContentSerializer;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionTask;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import de.eshg.lib.procedure.domain.serialization.SerializationObjectMapperConfigurer;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InspectionProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.INSPECTION;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.INSPECTION_LEADER;
  }

  @Bean
  SummaryProvider<InspectionTask, Inspection> summaryProvider(FacilityClient facilityClient) {
    return new SummaryProvider<>() {
      @Override
      public Map<Long, String> getTaskSummaries(List<InspectionTask> tasks) {
        Map<UUID, String> facilityNameByCentralFileStateId =
            getFacilityNamesByCentralFileStateIds(
                tasks, task -> task.getProcedure().getCentralFileStateId());

        return tasks.stream()
            .collect(
                Collectors.toMap(
                    SequencedBaseEntity::getId,
                    task ->
                        mapToTaskSummary(
                            facilityNameByCentralFileStateId.get(
                                task.getProcedure().getCentralFileStateId()),
                            task.getTaskType())));
      }

      @Override
      public Map<Long, String> getProcedureSummaries(List<Inspection> procedures) {
        Map<UUID, String> facilityNameByCentralFileStateId =
            getFacilityNamesByCentralFileStateIds(procedures, Inspection::getCentralFileStateId);

        return procedures.stream()
            .collect(
                Collectors.toMap(
                    Inspection::getId,
                    inspection ->
                        mapToInspectionTitle(
                            facilityNameByCentralFileStateId.get(
                                inspection.getCentralFileStateId()))));
      }

      private <T> Map<UUID, String> getFacilityNamesByCentralFileStateIds(
          List<T> list, Function<T, UUID> centralFileStateIdExtraction) {
        List<UUID> fileStateIds = list.stream().map(centralFileStateIdExtraction).toList();
        if (fileStateIds.isEmpty()) {
          return Map.of();
        }

        List<AddFacilityFileStateResponse> facilityFileStates =
            facilityClient.getFacilityFileStates(fileStateIds);

        return facilityFileStates.stream()
            .collect(
                Collectors.toMap(
                    AddFacilityFileStateResponse::id, AddFacilityFileStateResponse::name));
      }
    };
  }

  @Bean
  SerializationObjectMapperConfigurer serializationObjectMapperConfigurer() {
    return new SerializationObjectMapperConfigurer() {
      @Override
      public void configure(
          ObjectMapper objectMapper,
          BiConsumer<String, byte[]> fileContentConsumer,
          UnaryOperator<String> collisionFreeFileNameCreation) {
        MediaFileContentSerializer serializer =
            new MediaFileContentSerializer(fileContentConsumer, collisionFreeFileNameCreation);
        objectMapper.registerModule(new SimpleModule().addSerializer(serializer));
      }
    };
  }
}

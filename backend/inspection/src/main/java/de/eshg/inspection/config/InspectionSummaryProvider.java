/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config;

import static de.eshg.inspection.inspection.InspectionMapper.mapToInspectionTitle;
import static de.eshg.inspection.inspection.InspectionMapper.mapToTaskSummary;

import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionTask;
import de.eshg.lib.procedure.procedures.SummaryProvider;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
class InspectionSummaryProvider implements SummaryProvider<InspectionTask, Inspection> {
  private final FacilityClient facilityClient;

  public InspectionSummaryProvider(FacilityClient facilityClient) {
    this.facilityClient = facilityClient;
  }

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
                        facilityNameByCentralFileStateId.get(inspection.getCentralFileStateId()))));
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
            Collectors.toMap(AddFacilityFileStateResponse::id, AddFacilityFileStateResponse::name));
  }
}

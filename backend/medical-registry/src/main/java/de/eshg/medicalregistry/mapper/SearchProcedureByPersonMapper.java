/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import static de.eshg.medicalregistry.mapper.ProcedureMapper.mapStatusToDto;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesResponse;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.medicalregistry.api.MedicalRegistryEntrySearchResultDto;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.Practice;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.stereotype.Component;

@Component
public class SearchProcedureByPersonMapper
    implements de.eshg.lib.procedure.procedures.ProcedureMapper<
        MedicalRegistryProcedure, MedicalRegistryEntrySearchResultDto> {

  private final FacilityApi facilityApi;

  public SearchProcedureByPersonMapper(FacilityApi facilityApi) {
    this.facilityApi = facilityApi;
  }

  @Override
  public Map<UUID, List<MedicalRegistryEntrySearchResultDto>> mapToInterface(
      Map<UUID, List<MedicalRegistryProcedure>> domainProcedures) {
    Map<UUID, GetFacilityFileStateResponse> facilityFileStateById =
        resolveFacilityFileStates(domainProcedures);
    return domainProcedures.entrySet().stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Entry::getKey, entry -> mapToInterface(entry.getValue(), facilityFileStateById)));
  }

  private Map<UUID, GetFacilityFileStateResponse> resolveFacilityFileStates(
      Map<UUID, List<MedicalRegistryProcedure>> domainProcedures) {
    List<UUID> fileStateIds = collectFacilityFileStates(domainProcedures);

    if (fileStateIds.isEmpty()) {
      return Map.of();
    }

    GetFacilityFileStatesResponse facilityFileStates =
        facilityApi.getFacilityFileStates(new GetFacilityFileStatesRequest(fileStateIds));

    return facilityFileStates.facilityFileStates().stream()
        .collect(StreamUtil.toLinkedHashMap(GetFacilityFileStateResponse::id, Function.identity()));
  }

  private List<UUID> collectFacilityFileStates(
      Map<UUID, List<MedicalRegistryProcedure>> procedures) {
    return procedures.values().stream()
        .flatMap(Collection::stream)
        .map(Procedure::getRelatedFacilities)
        .flatMap(Collection::stream)
        .map(RelatedFacility::getCentralFileStateId)
        .distinct()
        .toList();
  }

  private List<MedicalRegistryEntrySearchResultDto> mapToInterface(
      List<MedicalRegistryProcedure> value,
      Map<UUID, GetFacilityFileStateResponse> facilityFileStateById) {
    return value.stream()
        .map(medicalRegistryEntry -> mapToInterface(medicalRegistryEntry, facilityFileStateById))
        .toList();
  }

  public MedicalRegistryEntrySearchResultDto mapToInterface(
      MedicalRegistryProcedure medicalRegistryEntry,
      Map<UUID, GetFacilityFileStateResponse> facilityFileStateById) {
    return new MedicalRegistryEntrySearchResultDto(
        medicalRegistryEntry.getExternalId(),
        medicalRegistryEntry.getVersion(),
        medicalRegistryEntry.getCreatedAt(),
        medicalRegistryEntry.getModifiedAt(),
        mapStatusToDto(medicalRegistryEntry.getProcedureStatus()),
        mapToPracticeNames(medicalRegistryEntry.getRelatedFacilities(), facilityFileStateById));
  }

  private List<String> mapToPracticeNames(
      List<Practice> relatedFacilities,
      Map<UUID, GetFacilityFileStateResponse> facilityFileStateById) {
    return relatedFacilities.stream()
        .map(RelatedFacility::getCentralFileStateId)
        .map(facilityFileStateById::get)
        .map(GetFacilityFileStateResponse::name)
        .toList();
  }
}

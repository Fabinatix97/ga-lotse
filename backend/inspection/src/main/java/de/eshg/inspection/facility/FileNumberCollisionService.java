/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import static java.util.stream.Collectors.toUnmodifiableMap;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesFilteredRequest;
import de.eshg.inspection.config.InspectionPropertiesConfigService;
import de.eshg.inspection.config.persistence.FacilityFileNumberMethod;
import de.eshg.inspection.inspection.api.FileNumberCollisionInspectionDto;
import de.eshg.inspection.inspection.api.GetFileNumberCollisionsResponse;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacility;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacilityRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class FileNumberCollisionService {

  private final FacilityClient facilityClient;
  private final Clock clock;
  private final InspectionRelatedFacilityRepository inspectionRelatedFacilityRepository;
  private final InspectionPropertiesConfigService inspectionPropertiesConfigService;

  public FileNumberCollisionService(
      FacilityClient facilityClient,
      Clock clock,
      InspectionRelatedFacilityRepository inspectionRelatedFacilityRepository,
      InspectionPropertiesConfigService inspectionPropertiesConfigService) {
    this.facilityClient = facilityClient;
    this.clock = clock;
    this.inspectionRelatedFacilityRepository = inspectionRelatedFacilityRepository;
    this.inspectionPropertiesConfigService = inspectionPropertiesConfigService;
  }

  public GetFileNumberCollisionsResponse getPossibleFileNumberCollisionsForFileState(
      UUID centralFileStateId, boolean suppressIfAllAreTheSameReferenceFacilityAndSuffix) {
    FacilityFileNumberMethod facilityFileNumberMethod =
        inspectionPropertiesConfigService.getConfiguration().getFacilityFileNumberMethod();

    if (!"INSPECTION_FRANKFURT".equals(facilityFileNumberMethod.name())) {
      return new GetFileNumberCollisionsResponse(Collections.emptyMap());
    }

    GetFacilityFileStateResponse fileState =
        facilityClient.getFacilityFileState(centralFileStateId);

    if (fileState.contactAddress() instanceof DomesticAddressDto domesticAddress) {
      return getPossibleFileNumberCollisionsForFileState(
          centralFileStateId,
          domesticAddress.postalCode(),
          domesticAddress.street(),
          domesticAddress.houseNumber(),
          suppressIfAllAreTheSameReferenceFacilityAndSuffix);
    } else {
      return new GetFileNumberCollisionsResponse(Collections.emptyMap());
    }
  }

  public GetFileNumberCollisionsResponse getPossibleFileNumberCollisionsForFileState(
      UUID centralFileStateId,
      String postalCode,
      String street,
      String houseNumber,
      boolean suppressIfAllAreTheSameReferenceFacilityAndSuffix) {
    FacilityFileNumberMethod facilityFileNumberMethod =
        inspectionPropertiesConfigService.getConfiguration().getFacilityFileNumberMethod();

    if (!"INSPECTION_FRANKFURT".equals(facilityFileNumberMethod.name())) {
      return new GetFileNumberCollisionsResponse(Collections.emptyMap());
    }

    Map<UUID, GetFacilityFileStateResponse> facilityFileStateMap =
        fetchCentralFileDataFiltered(
            new GetFacilityFileStatesFilteredRequest(
                null,
                null,
                postalCode,
                null,
                street,
                houseNumber,
                null,
                null,
                Collections.emptyList()));

    List<InspectionRelatedFacility> inspectionRelatedFacilities =
        inspectionRelatedFacilityRepository.findAllByCentralFileStateIdIn(
            facilityFileStateMap.keySet().stream()
                .filter(id -> !centralFileStateId.equals(id))
                .toList());

    Map<Integer, List<InspectionRelatedFacility>> suffixMap =
        inspectionRelatedFacilities.stream()
            .collect(
                Collectors.groupingBy(
                    irf ->
                        Optional.ofNullable(irf.getProcedure().getFileNumberSuffix()).orElse(0)));

    SortedMap<Integer, List<FileNumberCollisionInspectionDto>> collisionInspections =
        new TreeMap<>();
    for (Map.Entry<Integer, List<InspectionRelatedFacility>> entry : suffixMap.entrySet()) {
      collisionInspections.put(
          entry.getKey(),
          entry.getValue().stream()
              .map(
                  inspectionRelatedFacility ->
                      new FileNumberCollisionInspectionDto(
                          inspectionRelatedFacility.getProcedure().getExternalId(),
                          facilityFileStateMap
                              .get(inspectionRelatedFacility.getCentralFileStateId())
                              .name(),
                          inspectionRelatedFacility.getProcedure().getProcedureStatus(),
                          getDateOfInspection(inspectionRelatedFacility.getProcedure())))
              .sorted(
                  Comparator.comparing(FileNumberCollisionInspectionDto::facilityName)
                      .thenComparing(FileNumberCollisionInspectionDto::dayOfInspection)
                      .thenComparing(FileNumberCollisionInspectionDto::inspectionStatus)
                      .thenComparing(FileNumberCollisionInspectionDto::inspectionId))
              .toList());
    }

    if (suppressIfAllAreTheSameReferenceFacilityAndSuffix && suffixMap.keySet().size() == 1) {
      Set<UUID> fileStatesOfSameReferenceFacility =
          new HashSet<>(
              facilityClient.getFacilityFileStateIdsWithSameReferenceFacility(centralFileStateId));

      if (fileStatesOfSameReferenceFacility.containsAll(facilityFileStateMap.keySet())) {
        return null;
      }
    }

    return new GetFileNumberCollisionsResponse(collisionInspections);
  }

  private Map<UUID, GetFacilityFileStateResponse> fetchCentralFileDataFiltered(
      GetFacilityFileStatesFilteredRequest request) {
    if (request.fileStateIds() != null && request.fileStateIds().isEmpty()) {
      return Map.of();
    }
    var facilityFileStates =
        facilityClient.getFacilityFileStatesFiltered(request).facilityFileStates();

    return facilityFileStates.stream()
        .collect(toUnmodifiableMap(GetFacilityFileStateResponse::id, facility -> facility));
  }

  private LocalDate getDateOfInspection(Inspection inspection) {
    InspectionAppointment appointment =
        inspection.getExecutionAppointment() != null
            ? inspection.getExecutionAppointment()
            : inspection.getPlannedAppointment();
    if (appointment == null) {
      return null;
    }
    return LocalDate.ofInstant(appointment.getAppointmentStart(), clock.getZone());
  }
}

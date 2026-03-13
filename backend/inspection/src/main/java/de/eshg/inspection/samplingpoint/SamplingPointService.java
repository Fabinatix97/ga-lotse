/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.samplingpoint;

import static de.eshg.inspection.samplingpoint.SamplingPointMapper.mapBaseSamplingPointAddRequestWithCFSId;
import static de.eshg.inspection.samplingpoint.SamplingPointMapper.mapToSamplingPointDto;
import static de.eshg.inspection.samplingpoint.SamplingPointMapper.mapToUpdateReferenceSamplingPointRequest;

import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointsResponse;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.FacilityCentralFileState;
import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.inspection.samplingpoint.api.CreateSamplingPointRequest;
import de.eshg.inspection.samplingpoint.api.GetFacilitiesForSamplingPointsResponse;
import de.eshg.inspection.samplingpoint.api.SamplingPointDto;
import de.eshg.inspection.samplingpoint.api.SamplingPointFacilityDto;
import de.eshg.inspection.samplingpoint.api.UpdateSamplingPointRequest;
import de.eshg.rest.service.error.BadRequestException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class SamplingPointService {

  private final FacilityRepository facilityRepository;
  private final FacilityClient facilityClient;
  private final SamplingPointClient samplingPointClient;
  private final UserApi userApi;

  public SamplingPointService(
      FacilityRepository facilityRepository,
      FacilityClient facilityClient,
      SamplingPointClient samplingPointClient,
      UserApi userApi) {
    this.facilityRepository = facilityRepository;
    this.facilityClient = facilityClient;
    this.samplingPointClient = samplingPointClient;
    this.userApi = userApi;
  }

  public SamplingPointDto createSamplingPoint(CreateSamplingPointRequest request) {
    Optional<Facility> optFac = facilityRepository.findByExternalId(request.facilityId());
    if (optFac.isEmpty()) {
      throw new BadRequestException(
          "facility with external id " + request.facilityId() + " does not exist");
    }
    AddSamplingPointFileStateResponse baseResponse =
        samplingPointClient.addSamplingPointFileState(
            mapBaseSamplingPointAddRequestWithCFSId(
                request, optFac.get().getOriginalCentralFileStateId()));
    return mapToSamplingPointDto(baseResponse);
  }

  public SamplingPointDto updateSamplingPoint(
      UUID samplingPointId, UpdateSamplingPointRequest request) {
    AddSamplingPointFileStateResponse baseResponse =
        samplingPointClient.updateReferenceSamplingPoint(
            samplingPointId, mapToUpdateReferenceSamplingPointRequest(request));
    return mapToSamplingPointDto(baseResponse);
  }

  public List<SamplingPointDto> getSamplingPointsFor(UUID externalFacilityId, String namePrefix) {
    Optional<Facility> optFac = facilityRepository.findByExternalId(externalFacilityId);
    if (optFac.isEmpty()) {
      throw new BadRequestException(
          "Facility with external id " + externalFacilityId + " not found");
    }
    Facility facility = optFac.get();
    GetReferenceSamplingPointsResponse samplingPointsResponse =
        samplingPointClient.getReferenceSamplingPointsByFacilityFileStateId(
            facility.getOriginalCentralFileStateId(), externalFacilityId, namePrefix);
    if (samplingPointsResponse.samplingPoints().isEmpty()) {
      return List.of();
    }
    GetReferenceSamplingPointResponse spr = samplingPointsResponse.samplingPoints().getFirst();
    UUID assigneeId = facility.getAssigneeId();
    UserDto userDto = assigneeId == null ? null : userApi.getUser(assigneeId);
    var facDto =
        new SamplingPointFacilityDto(facility.getExternalId(), spr.facilityName(), userDto);
    return samplingPointsResponse.samplingPoints().stream()
        .map(s -> SamplingPointMapper.mapToSamplingPointDtoModifyFacility(s, facDto))
        .toList();
  }

  public Map<UUID, UUID> getMapCFSIdExtId() {
    List<FacilityCentralFileState> pairsIdCFS = facilityRepository.centralFileStateByFacilityId();
    Map<UUID, UUID> mapCFSIdExtId = new HashMap<>();
    for (FacilityCentralFileState pairIdFS : pairsIdCFS) {
      mapCFSIdExtId.put(pairIdFS.originalCentralFileStateId(), pairIdFS.centralFileStateId());
    }
    return mapCFSIdExtId;
  }

  public List<SamplingPointDto> getAllSamplingPoints(String namePrefix) {
    Map<UUID, UUID> mapCFSIdExtId = getMapCFSIdExtId();
    Map<UUID, GetReferenceFacilityResponse> mapCFSIdRefFac =
        facilityClient.getReferenceFacilitiesByCFSId(mapCFSIdExtId.keySet());
    Map<UUID, UUID> mapRefIDCFSId = new HashMap<>();
    for (Map.Entry<UUID, GetReferenceFacilityResponse> entry : mapCFSIdRefFac.entrySet()) {
      mapRefIDCFSId.put(entry.getValue().id(), entry.getKey());
    }
    GetReferenceSamplingPointsResponse samplingPointsResponse =
        samplingPointClient.getAllReferenceSamplingPoints(namePrefix);

    Map<UUID, SamplingPointFacilityDto> mapRefIdFacDto = new HashMap<>();
    for (GetReferenceSamplingPointResponse resp : samplingPointsResponse.samplingPoints()) {
      UUID referenceFacilityId = resp.facilityId();
      if (!mapRefIdFacDto.containsKey(referenceFacilityId)) {
        UUID fileStateFacilityId = mapRefIDCFSId.get(referenceFacilityId);
        UUID externalFacId = mapCFSIdExtId.get(fileStateFacilityId);
        Optional<Facility> optFac = facilityRepository.findByExternalId(externalFacId);
        if (optFac.isEmpty()) {
          throw new BadRequestException("facility with external id " + externalFacId + " unknown");
        }
        Facility fac = optFac.get();
        UserDto user = fac.getAssigneeId() == null ? null : userApi.getUser(fac.getAssigneeId());
        var facDto = new SamplingPointFacilityDto(fac.getExternalId(), resp.facilityName(), user);
        mapRefIdFacDto.put(referenceFacilityId, facDto);
      }
    }

    return samplingPointsResponse.samplingPoints().stream()
        .map(
            x ->
                SamplingPointMapper.mapToSamplingPointDtoModifyFacility(
                    x, mapRefIdFacDto.get(x.facilityId())))
        .toList();
  }

  public GetFacilitiesForSamplingPointsResponse getFacilities() {
    Map<UUID, UUID> mapCFSIdExtId = getMapCFSIdExtId();
    Map<UUID, GetReferenceFacilityResponse> referenceFacilitiesByCFSId =
        facilityClient.getReferenceFacilitiesByCFSId(mapCFSIdExtId.keySet());
    Map<UUID, GetReferenceFacilityResponse> mapExtIdCFSFac = new HashMap<>();
    for (Map.Entry<UUID, GetReferenceFacilityResponse> idCFSReferenceFacility :
        referenceFacilitiesByCFSId.entrySet()) {
      mapExtIdCFSFac.put(
          mapCFSIdExtId.get(idCFSReferenceFacility.getKey()), idCFSReferenceFacility.getValue());
    }
    return new GetFacilitiesForSamplingPointsResponse(mapExtIdCFSFac);
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.mapper;

import static de.eshg.base.centralfile.SamplingPointController.FACILITY_NOT_FOUND;
import static de.eshg.base.util.MappingUtil.mapDataOriginToApi;
import static de.eshg.base.util.MappingUtil.mapDataOriginToDm;

import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateRequest;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStatesResponse;
import de.eshg.base.centralfile.api.samplingpoint.SamplingPointDetails;
import de.eshg.base.centralfile.api.samplingpoint.UpdateReferenceSamplingPointRequest;
import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.SamplingPoint;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.rest.service.error.NotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class SamplingPointMapper {
  private final FacilityRepository facilityRepository;

  public SamplingPointMapper(FacilityRepository facilityRepository) {
    this.facilityRepository = facilityRepository;
  }

  public static AddSamplingPointFileStateResponse mapSamplingPointFileStateToApi(
      SamplingPoint samplingPoint) {
    return new AddSamplingPointFileStateResponse(
        samplingPoint.getExternalId(),
        samplingPoint.getName(),
        samplingPoint.getZid(),
        samplingPoint.getReferenceFacility().getExternalId(),
        samplingPoint.getReferenceFacility().getName(),
        mapDataOriginToApi(samplingPoint.getDataOrigin()),
        samplingPoint.getReferenceVersion());
  }

  public static GetReferenceSamplingPointResponse mapReferenceSamplingPointToApi(
      SamplingPoint referenceSamplingPoint) {
    return new GetReferenceSamplingPointResponse(
        referenceSamplingPoint.getExternalId(),
        referenceSamplingPoint.getVersion(),
        referenceSamplingPoint.getName(),
        referenceSamplingPoint.getZid(),
        referenceSamplingPoint.getReferenceFacility().getExternalId(),
        referenceSamplingPoint.getReferenceFacility().getName(),
        mapDataOriginToApi(referenceSamplingPoint.getDataOrigin()));
  }

  public static GetSamplingPointFileStateResponse
      mapSamplingPointToGetSamplingPointFileStateResponse(
          SamplingPoint samplingPoint, Boolean outdated) {
    return new GetSamplingPointFileStateResponse(
        samplingPoint.getExternalId(),
        samplingPoint.getName(),
        samplingPoint.getZid(),
        samplingPoint.getReferenceFacility().getExternalId(),
        samplingPoint.getReferenceVersion(),
        outdated,
        mapDataOriginToApi(samplingPoint.getDataOrigin()));
  }

  public static GetSamplingPointFileStatesResponse mapToGetSamplingPointFileStatesResponse(
      Set<UUID> queryIds, List<SamplingPoint> foundFileStates, Map<UUID, Boolean> outdated) {

    List<UUID> notFoundIds = new ArrayList<>(queryIds);
    List<GetSamplingPointFileStateResponse> samplingPointResponses = new ArrayList<>();

    for (SamplingPoint fileState : foundFileStates) {
      samplingPointResponses.add(
          mapSamplingPointToGetSamplingPointFileStateResponse(
              fileState, outdated.get(fileState.getExternalId())));
      notFoundIds.remove(fileState.getExternalId());
    }
    return new GetSamplingPointFileStatesResponse(samplingPointResponses, notFoundIds);
  }

  public SamplingPoint mapSamplingPointToDm(AddSamplingPointFileStateRequest request) {
    Facility facility =
        facilityRepository
            .findByExternalId(request.facilityId())
            .orElseThrow(() -> new NotFoundException(FACILITY_NOT_FOUND));
    if (facility.getReferenceFacility() != null) {
      facility = facility.getReferenceFacility();
    }
    SamplingPoint samplingPoint = mapBaseSamplingPointToDm(request);
    samplingPoint.setReferenceFacility(facility);
    samplingPoint.setDataOrigin(mapDataOriginToDm(request.dataOrigin()));
    return samplingPoint;
  }

  public static SamplingPoint mapSamplingPointToDm(UpdateReferenceSamplingPointRequest request) {
    SamplingPoint result = mapBaseSamplingPointToDm(request.samplingPointDetails());
    result.setDataOrigin(DataOrigin.EDIT);
    return result;
  }

  private static SamplingPoint mapBaseSamplingPointToDm(SamplingPointDetails request) {
    SamplingPoint samplingPoint = new SamplingPoint();
    samplingPoint.setName(request.name());
    samplingPoint.setZid(request.zid());
    return samplingPoint;
  }
}

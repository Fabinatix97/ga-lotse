/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateRequest;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointsResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStatesRequest;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStatesResponse;
import de.eshg.base.centralfile.api.samplingpoint.UpdateReferenceSamplingPointRequest;
import de.eshg.base.centralfile.mapper.SamplingPointMapper;
import de.eshg.base.centralfile.persistence.FacilityService;
import de.eshg.base.centralfile.persistence.SamplingPointService;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.SamplingPoint;
import de.eshg.base.centralfile.persistence.repository.SamplingPointRepository;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "SamplingPoint")
public class SamplingPointController implements SamplingPointApi {

  public static final String SAMPLING_POINT_FILE_STATE_NOT_FOUND = "SamplingPoint %s not found";
  public static final String SAMPLING_POINT_REFERENCE_NOT_FOUND =
      "SamplingPointReference %s not found";
  public static final String FACILITY_NOT_FOUND = "Facility not found";
  private final SamplingPointService samplingPointService;
  private final SamplingPointRepository samplingPointRepository;
  private final SamplingPointMapper samplingPointMapper;
  private final BaseFeatureToggle baseFeatureToggle;
  private final FacilityService facilityService;

  public SamplingPointController(
      SamplingPointService samplingPointService,
      SamplingPointRepository samplingPointRepository,
      SamplingPointMapper samplingPointMapper,
      BaseFeatureToggle baseFeatureToggle,
      FacilityService facilityService) {
    this.samplingPointService = samplingPointService;
    this.samplingPointRepository = samplingPointRepository;
    this.samplingPointMapper = samplingPointMapper;
    this.baseFeatureToggle = baseFeatureToggle;
    this.facilityService = facilityService;
  }

  @Override
  @Transactional
  public AddSamplingPointFileStateResponse addSamplingPointFileState(
      AddSamplingPointFileStateRequest request) {
    assertFeatureToggle();
    return samplingPointService.addSamplingPointFileState(
        samplingPointMapper.mapSamplingPointToDm(request), request.referenceSamplingPointId());
  }

  @Override
  @Transactional(readOnly = true)
  public GetSamplingPointFileStateResponse getSamplingPointFileState(UUID id) {
    assertFeatureToggle();
    SamplingPoint samplingPoint =
        samplingPointRepository
            .findFileStateByExternalId(id)
            .orElseThrow(
                () -> new NotFoundException(SAMPLING_POINT_FILE_STATE_NOT_FOUND.formatted(id)));
    return mapSamplingPointToGetSamplingPointFileStateResponse(samplingPoint);
  }

  @Override
  @Transactional(readOnly = true)
  public GetReferenceSamplingPointResponse getReferenceSamplingPoint(UUID id) {
    assertFeatureToggle();
    SamplingPoint referenceFacility = findReferenceSamplingPoint(id);
    return SamplingPointMapper.mapReferenceSamplingPointToApi(referenceFacility);
  }

  @Override
  @Transactional(readOnly = true)
  public GetReferenceSamplingPointsResponse getAllReferenceSamplingPoints(String namePrefix) {
    assertFeatureToggle();

    return new GetReferenceSamplingPointsResponse(
        findAllReferenceSamplingPoints(namePrefix).stream()
            .map(SamplingPointMapper::mapReferenceSamplingPointToApi)
            .toList());
  }

  @Override
  @Transactional(readOnly = true)
  public GetReferenceSamplingPointsResponse getReferenceSamplingPointsByFacilityFileStateId(
      UUID facilityFileStateId, String namePrefix) {
    assertFeatureToggle();
    List<SamplingPoint> referenceSamplingPoints =
        findReferenceSamplingPointsByFacilityFileStateId(facilityFileStateId, namePrefix);
    return new GetReferenceSamplingPointsResponse(
        referenceSamplingPoints.stream()
            .map(SamplingPointMapper::mapReferenceSamplingPointToApi)
            .toList());
  }

  @Override
  @Transactional(readOnly = true)
  public GetSamplingPointFileStatesResponse searchReferenceSamplingPoints(String zid) {
    assertFeatureToggle();
    List<SamplingPoint> result =
        samplingPointRepository.findByReferenceSamplingPoint_ZidEndsWithOrderByIdAsc(zid);

    return new GetSamplingPointFileStatesResponse(
        result.stream()
            .map(SamplingPointController::mapSamplingPointToGetSamplingPointFileStateResponse)
            .toList(),
        Collections.emptyList());
  }

  @Override
  public GetFileStateIdsResponse getSiblingFileStateIds(UUID id) {
    List<UUID> fileStates =
        samplingPointRepository
            .findReferenceSamplingPointByExternalId(id)
            .map(SamplingPoint::getId)
            .map(samplingPointRepository::findAllByReferenceSamplingPointIdOrderByIdAsc)
            .stream()
            .flatMap(Collection::stream)
            .map(SamplingPoint::getExternalId)
            .toList();

    return new GetFileStateIdsResponse(fileStates);
  }

  @Override
  public GetFileStateIdsResponse getChildFacilityFileStateIds(UUID referenceId) {
    List<UUID> fileStates =
        samplingPointRepository.findAllByReferenceSamplingPoint_ExternalId(referenceId).stream()
            .map(SamplingPoint::getExternalId)
            .toList();

    return new GetFileStateIdsResponse(fileStates);
  }

  @Override
  @Transactional(readOnly = true)
  public GetSamplingPointFileStatesResponse getSamplingPointFileStates(
      GetSamplingPointFileStatesRequest request) {
    assertFeatureToggle();
    List<SamplingPoint> samplingPointFileStates =
        samplingPointRepository.findAllByExternalIdInAndReferenceSamplingPointIsNotNullOrderByIdAsc(
            request.fileStateIds());
    Map<UUID, Boolean> outdatedByFileStateId =
        getOutdatedFileStateMap(request, samplingPointFileStates);

    return SamplingPointMapper.mapToGetSamplingPointFileStatesResponse(
        request.fileStateIds(), samplingPointFileStates, outdatedByFileStateId);
  }

  private static Map<UUID, Boolean> getOutdatedFileStateMap(
      GetSamplingPointFileStatesRequest request, List<SamplingPoint> samplingPointFileStates) {
    if (Boolean.TRUE.equals(request.checkOutdated())) {
      return samplingPointFileStates.stream()
          .collect(
              StreamUtil.toLinkedHashMap(
                  SamplingPoint::getExternalId,
                  facilityFileState ->
                      SamplingPointService.isSamplingPointFileStateOutdated(
                          facilityFileState, facilityFileState.getReferenceSamplingPoint())));
    } else {
      return Collections.emptyMap();
    }
  }

  @Override
  @Transactional
  public AddSamplingPointFileStateResponse updateReferenceSamplingPoint(
      UUID fileStateId, UpdateReferenceSamplingPointRequest request) {
    assertFeatureToggle();
    SamplingPoint referenceFacilityUpdate = SamplingPointMapper.mapSamplingPointToDm(request);

    return samplingPointService.updateReferenceSamplingPoint(
        fileStateId, request.version(), referenceFacilityUpdate);
  }

  private static GetSamplingPointFileStateResponse
      mapSamplingPointToGetSamplingPointFileStateResponse(SamplingPoint samplingPointFileState) {
    boolean outdated =
        SamplingPointService.isSamplingPointFileStateOutdated(
            samplingPointFileState, samplingPointFileState.getReferenceSamplingPoint());
    return SamplingPointMapper.mapSamplingPointToGetSamplingPointFileStateResponse(
        samplingPointFileState, outdated);
  }

  /**
   * Retrieve the reference data of a SamplingPoint entity identified by an id
   *
   * @param id: external id, either of the reference data, or an existing file state id
   * @return the entity data
   */
  private SamplingPoint findReferenceSamplingPoint(UUID id) {
    return samplingPointRepository
        .findReferenceSamplingPointByExternalId(id)
        .orElseGet(
            () ->
                samplingPointRepository
                    .findSamplingPointByExternalIdAndReferenceSamplingPointIsNull(id)
                    .orElseThrow(
                        () ->
                            new NotFoundException(
                                "Sampling Point File State with given ID (or associated Reference Sampling Point) not found")));
  }

  private List<SamplingPoint> findReferenceSamplingPointsByFacilityFileStateId(
      UUID facilityFileStateId, String namePrefix) {
    Facility referenceFacility =
        facilityService.getReferenceFacilityByFileStateId(facilityFileStateId);
    return samplingPointRepository
        .findAllByReferenceSamplingPointIsNullAndReferenceFacilityExternalIdAndNameStartsWithIgnoreCaseOrderByIdAsc(
            referenceFacility.getExternalId(), namePrefix);
  }

  private List<SamplingPoint> findAllReferenceSamplingPoints(String namePrefix) {
    return samplingPointRepository
        .findByReferenceSamplingPointIsNullAndNameStartsWithIgnoreCaseOrderByIdAsc(namePrefix);
  }

  private void assertFeatureToggle() {
    if (!baseFeatureToggle.isNewFeatureEnabled(BaseFeature.SAMPLES)) {
      throw new BadRequestException("Feature toggle for samples is not enabled!");
    }
  }
}

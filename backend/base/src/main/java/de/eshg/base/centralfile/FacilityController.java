/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import static de.eshg.base.util.SearchSpecificationUtil.getSimilarityThreshold;

import de.eshg.base.centralfile.api.*;
import de.eshg.base.centralfile.api.facility.*;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.base.centralfile.mapper.FacilityMapper;
import de.eshg.base.centralfile.persistence.FacilityService;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.centralfile.persistence.repository.FacilitySearchSpecification;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Facility")
public class FacilityController implements FacilityApi {

  public static final String FACILITY_FILE_STATE_NOT_FOUND = "FacilityFileState not found";
  public static final String FACILITY_REFERENCE_NOT_FOUND = "FacilityReference not found";

  private final FacilityRepository facilityRepository;
  private final FacilityService facilityService;
  private final FacilityMapper facilityMapper;
  private final BaseFeatureToggle featureToggle;
  private final EntityManager entityManager;
  private final Clock clock;

  public FacilityController(
      FacilityRepository facilityRepository,
      FacilityService facilityService,
      FacilityMapper facilityMapper,
      BaseFeatureToggle featureToggle,
      EntityManager entityManager,
      Clock clock) {
    this.facilityRepository = facilityRepository;
    this.facilityService = facilityService;
    this.facilityMapper = facilityMapper;
    this.featureToggle = featureToggle;
    this.entityManager = entityManager;
    this.clock = clock;
  }

  @Override
  @Transactional
  public AddFacilityFileStateResponse addFacilityFileState(AddFacilityFileStateRequest request) {
    FacilityMapper.validateAddFacilityFileStateRequest(request);

    Facility savedFacilityFileState =
        facilityService.addFacilityFileState(
            FacilityMapper.mapFacilityToDm(request),
            request.referenceFacilityId(),
            FacilityMapper.isUsePartialMatch(request));
    return FacilityMapper.mapFacilityFileStateToApi(savedFacilityFileState);
  }

  @Override
  @Transactional(readOnly = true)
  public GetFacilityFileStateResponse getFacilityFileState(UUID id) {
    Facility facility =
        facilityRepository
            .findFileStateByExternalId(id)
            .orElseThrow(() -> new NotFoundException(FACILITY_FILE_STATE_NOT_FOUND));
    return mapFacilityToGetFacilityFileStateResponse(facility);
  }

  @Override
  @Transactional(readOnly = true)
  public GetReferenceFacilityResponse getReferenceFacility(UUID id) {
    Facility referenceFacility = findReferenceFacility(id);
    return FacilityMapper.mapReferenceFacilityToApi(referenceFacility);
  }

  @Override
  @Transactional(readOnly = true)
  public SearchReferenceFacilitiesResponse searchReferenceFacilities(String name) {
    configureSimilarityThreshold(name);
    FacilitySearchSpecification spec = new FacilitySearchSpecification(name);

    List<GetReferenceFacilityResponse> facilities =
        facilityRepository.findAll(spec).stream()
            .map(FacilityMapper::mapReferenceFacilityToApi)
            .toList();

    return new SearchReferenceFacilitiesResponse(facilities);
  }

  private void configureSimilarityThreshold(String name) {
    double threshold = getSimilarityThreshold(name);
    entityManager
        .createNativeQuery("set local pg_trgm.similarity_threshold=" + threshold)
        .executeUpdate();
  }

  @Override
  @Transactional(readOnly = true)
  public GetFileStateIdsResponse getFacilityFileStateIdsWithSameReferenceFacility(UUID id) {
    Facility fileState =
        facilityRepository
            .findFileStateByExternalId(id)
            .orElseThrow(() -> new NotFoundException(FACILITY_FILE_STATE_NOT_FOUND));

    return findAllLinkedFileStates(fileState.getReferenceFacility().getId());
  }

  @Override
  public GetFileStateIdsResponse getFacilityFileStateIdsAssociatedWithReferenceFacility(
      UUID referenceId) {
    Facility referenceFacility =
        facilityRepository
            .findByExternalIdEqualsAndReferenceFacilityIsNull(referenceId)
            .orElseThrow(() -> new NotFoundException(FACILITY_REFERENCE_NOT_FOUND));

    return findAllLinkedFileStates(referenceFacility.getId());
  }

  private GetFileStateIdsResponse findAllLinkedFileStates(Long referenceId) {
    List<UUID> searchResultsFromDb =
        facilityRepository.findAllByReferenceFacilityIdOrderById(referenceId);
    return new GetFileStateIdsResponse(searchResultsFromDb);
  }

  @Override
  @Transactional(readOnly = true)
  public GetFacilityFileStatesResponse getFacilityFileStates(GetFacilityFileStatesRequest request) {
    List<UUID> queryIds = request.fileStateIds().stream().distinct().toList();

    List<Facility> facilityFileStates =
        facilityRepository
            .findAllByExternalIdInAndReferenceFacilityIsNotNullOrderByIdWithJoinFetches(queryIds);

    return FacilityMapper.mapToGetFacilityFileStatesResponse(queryIds, facilityFileStates);
  }

  @Override
  @Transactional
  public void markFacilityFileStateForDeletion(DeleteFileStatesRequest list) {
    facilityService.markAllForDeletionAt(
        list.fileStateIds(), Instant.now(clock).plus(Duration.ofDays(365)));
  }

  @Override
  @Transactional
  public void deleteFacilityFileStateDuringArchive(DeleteFileStatesRequest list) {
    facilityService.markAllForDeletionAt(list.fileStateIds(), Instant.now(clock));
  }

  @Override
  @Transactional(readOnly = true)
  public GetFacilityDiffResponse getFacilityDiff(UUID id) {
    Facility facilityFileState =
        facilityRepository
            .findByExternalIdEqualsAndReferenceFacilityIsNotNull(id)
            .orElseThrow(() -> new NotFoundException(FACILITY_FILE_STATE_NOT_FOUND));

    return facilityService.getFacilityDiff(facilityFileState);
  }

  @Override
  @Transactional
  public AddFacilityFileStateResponse updateFacilityFileStateAndReference(
      UUID id, PutFacilityRequest request) {
    Facility fileState =
        facilityRepository
            .findFileStateByExternalId(id)
            .orElseThrow(() -> new NotFoundException(FACILITY_FILE_STATE_NOT_FOUND));

    Facility fileStateUpdate = FacilityMapper.mapFacilityToDm(request);
    Facility savedFileStateUpdate =
        facilityService.updateFileStateAndReferenceFacility(fileState, fileStateUpdate);

    return FacilityMapper.mapFacilityFileStateToApi(savedFileStateUpdate);
  }

  @Override
  @Transactional
  public AddFacilityFileStateResponse syncFacilityFileState(UUID id, SyncFileStateRequest request) {
    Facility fileState =
        facilityRepository
            .findFileStateByExternalId(id)
            .orElseThrow(() -> new NotFoundException(FACILITY_FILE_STATE_NOT_FOUND));

    Facility savedFileStateUpdate = facilityService.syncFileState(fileState, request.version());

    return FacilityMapper.mapFacilityFileStateToApi(savedFileStateUpdate);
  }

  @Override
  @Transactional
  public AddFacilityFileStateResponse addFacilityFromExternalSource(
      ExternalAddFacilityFileStateRequest request) {
    Facility facilityFileState = FacilityMapper.mapFacilityToDm(request);
    Facility savedFacilityFileState =
        facilityService.addFacilityFromExternalSource(facilityFileState);

    return FacilityMapper.mapFacilityFileStateToApi(savedFacilityFileState);
  }

  @Override
  public AddFacilityFileStateResponse updateReferenceFacility(
      UUID referenceDataId, UpdateReferenceFacilityRequest request) {
    featureToggle.assertNewFeatureIsEnabled(BaseFeature.VERIFICATION_OF_EXTERNAL_DATA);

    Facility referenceFacilityUpdate = FacilityMapper.mapFacilityToDm(request);

    Facility updatedFacilityFileState =
        facilityService.updateReferenceFacility(
            referenceDataId, request.version(), referenceFacilityUpdate);

    return FacilityMapper.mapFacilityFileStateToApi(updatedFacilityFileState);
  }

  private Facility findReferenceFacility(UUID id) {
    return facilityRepository
        .findReferenceFacilityByFileStateExternalId(id)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Facility File State with ID %s (or associated Reference Facility) not found"
                        .formatted(id)));
  }

  private static GetFacilityFileStateResponse mapFacilityToGetFacilityFileStateResponse(
      Facility facilityFileState) {
    boolean outdated =
        FacilityService.isFacilityFileStateOutdated(
            facilityFileState, facilityFileState.getReferenceFacility());
    return FacilityMapper.mapFacilityToGetFacilityFileStateResponse(facilityFileState, outdated);
  }
}

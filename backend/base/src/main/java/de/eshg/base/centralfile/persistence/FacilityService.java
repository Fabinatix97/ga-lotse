/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import static de.eshg.base.centralfile.FacilityController.FACILITY_REFERENCE_NOT_FOUND;
import static de.eshg.base.util.SearchSpecificationUtil.getSimilarityThreshold;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.centralfile.CentralFileAuditLogger;
import de.eshg.base.centralfile.api.DiffDto;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDiffDto;
import de.eshg.base.centralfile.api.facility.FacilityDetailsDto;
import de.eshg.base.centralfile.api.facility.GetFacilityDiffResponse;
import de.eshg.base.centralfile.mapper.FacilityMapper;
import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.FacilityContactPerson;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.centralfile.persistence.repository.FacilitySearchSpecification;
import de.eshg.base.util.*;
import de.eshg.mutex.MutexService;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.time.Clock;
import java.time.Instant;
import java.util.*;
import org.apache.commons.lang3.builder.DiffResult;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

@Service
public class FacilityService {
  public static final String MUTEX_FACILITY_WRITE = "FACILITY_WRITE";
  private final FacilityRepository facilityRepository;
  private final FuzzySearchHelper fuzzySearchHelper;
  private final MutexService mutexService;
  private final CentralFileAuditLogger auditLogger;
  private final Clock clock;

  public FacilityService(
      FacilityRepository facilityRepository,
      FuzzySearchHelper fuzzySearchHelper,
      MutexService mutexService,
      CentralFileAuditLogger auditLogger,
      Clock clock) {
    this.facilityRepository = facilityRepository;
    this.mutexService = mutexService;
    this.auditLogger = auditLogger;
    this.fuzzySearchHelper = fuzzySearchHelper;
    this.clock = clock;
  }

  public List<Facility> searchReferenceFacilities(String name) {
    fuzzySearchHelper.setSimilarityThreshold(getSimilarityThreshold(name));
    FacilitySearchSpecification spec = new FacilitySearchSpecification(name);
    return facilityRepository.findAll(spec);
  }

  public Facility addFacilityFileState(
      Facility facilityFileState, UUID referenceFacilityId, boolean isUsePartialMatch) {
    return mutexService.doWithLockedMutex(
        MUTEX_FACILITY_WRITE,
        () ->
            addFacilityFileStateWhenLocked(
                facilityFileState, referenceFacilityId, isUsePartialMatch));
  }

  private Facility addFacilityFileStateWhenLocked(
      Facility facilityFileState, UUID referenceFacilityId, boolean isUsePartialMatch) {
    Facility referenceFacility =
        findOrAddReferenceFacilityForAddFacilityFileState(
            facilityFileState, referenceFacilityId, isUsePartialMatch);

    return addFacilityFileState(facilityFileState, referenceFacility);
  }

  private Facility findOrAddReferenceFacilityForAddFacilityFileState(
      Facility facilityFileState, UUID referenceFacilityId, boolean isUsePartialMatch) {

    if (referenceFacilityId != null) {
      return getReferenceFacility(referenceFacilityId);
    } else if (isUsePartialMatch) {
      return findPartiallyMatchingReferenceFacility(facilityFileState)
          .orElseGet(() -> addFacilityForFileState(facilityFileState));
    } else {
      return findMatchingReferenceFacility(facilityFileState)
          .orElseGet(() -> addFacilityForFileState(facilityFileState));
    }
  }

  public Facility getReferenceFacility(UUID referenceFacilityId) {
    return facilityRepository
        .findByExternalIdEqualsAndReferenceFacilityIsNull(referenceFacilityId)
        .orElseThrow(() -> new NotFoundException(FACILITY_REFERENCE_NOT_FOUND));
  }

  private Facility addFacilityFileState(Facility facilityFileState, Facility referenceFacility) {
    facilityFileState.setReferenceFacility(referenceFacility);
    facilityFileState.setReferenceVersion(referenceFacility.getVersion());
    referenceFacility.setDeleteAt(null);
    Facility savedFacilityFileState = facilityRepository.save(facilityFileState);

    auditLogger.logAddFileState(savedFacilityFileState);
    return savedFacilityFileState;
  }

  private Facility addFacilityForFileState(Facility facilityFileState) {
    Facility facility = facilityFileState.cloneFromFileState();
    Facility savedReferenceFacility = facilityRepository.save(facility);

    auditLogger.logAddReferenceData(savedReferenceFacility);
    return savedReferenceFacility;
  }

  public Optional<Facility> findMatchingReferenceFacility(Facility facility) {
    List<Facility> possibleMatches =
        facilityRepository.findReferenceFacilityByName(facility.getName());
    return possibleMatches.stream()
        .filter(f -> FacilityMatcher.isFacilityMatch(f, facility))
        .collect(StreamUtil.toSingleOptionalElement());
  }

  public Optional<Facility> findPartiallyMatchingReferenceFacility(Facility facility) {
    List<Facility> possibleMatches =
        facilityRepository.findReferenceFacilityByName(facility.getName());
    return possibleMatches.stream()
        .filter(
            f ->
                AddressMatcher.isAddressMatch(
                    f.getContactAddress(), facility.getContactAddress(), false, false))
        .min(Comparator.comparing(Facility::getId));
  }

  public static boolean isFacilityFileStateOutdated(
      Facility facilityFileState, Facility referenceFacility) {
    return !FacilityMatcher.isFacilityMatch(referenceFacility, facilityFileState);
  }

  public Instant getFileStateDeletionTimestamp(UUID id) {
    Facility facility = facilityRepository.findFileStateByExternalId(id).orElseThrow();
    return facility.getDeleteAt();
  }

  public Instant getReferenceDeletionTimestampForFileState(UUID fileStateId) {
    Facility facility =
        facilityRepository.findReferenceFacilityByFileStateExternalId(fileStateId).orElseThrow();
    return facility.getDeleteAt();
  }

  public void markAllForDeletionAt(Set<UUID> fileStateIds, Instant timestamp) {
    mutexService.doWithLockedMutex(
        MUTEX_FACILITY_WRITE, () -> markAllForDeletionAtWhenLocked(fileStateIds, timestamp));
  }

  public void markAllForDeletionAtWhenLocked(Set<UUID> fileStateIds, Instant timestamp) {
    List<Facility> fileStates = findAllFileStates(fileStateIds);

    Set<Facility> referenceFacilities = new LinkedHashSet<>();
    for (Facility fileState : fileStates) {
      Facility referenceFacility = fileState.getReferenceFacility();
      referenceFacilities.add(referenceFacility);
      fileState.setDeleteAt(timestamp);
      auditLogger.logDeleteFileState(fileState);
    }

    for (Facility referenceFacility : referenceFacilities) {
      if (referenceFacility.getDeleteAt() == null
          && facilityRepository.isReferenceFacilityObsolete(referenceFacility.getExternalId())) {
        referenceFacility.setDeleteAt(timestamp);
        auditLogger.logDeleteReferenceData(referenceFacility);
      }
    }
  }

  public Facility updateFileStateAndReferenceFacility(
      Facility facilityFileState, Facility fileStateUpdate) {
    return mutexService.doWithLockedMutex(
        MUTEX_FACILITY_WRITE,
        () -> updateFileStateAndReferenceFacilityWhenLocked(facilityFileState, fileStateUpdate));
  }

  private Facility updateFileStateAndReferenceFacilityWhenLocked(
      Facility facilityFileState, Facility fileStateUpdate) {
    Facility referenceFacility =
        facilityRepository
            .findReferenceFacilityByFileStateExternalId(facilityFileState.getExternalId())
            .orElseThrow(() -> new NotFoundException("Associated Reference Facility not found"));

    if (isFacilityFileStateOutdated(facilityFileState, referenceFacility)) {
      throw new BadRequestException(ErrorCode.CONFLICT, "Facility file state is outdated");
    }

    if (findMatchingReferenceFacility(fileStateUpdate).isPresent()) {
      throw new AlreadyExistsException("Matching reference facility already exists");
    }

    applyFacilityUpdate(fileStateUpdate, referenceFacility);
    facilityRepository.flush();

    auditLogger.logEditReferenceData(referenceFacility);
    fileStateUpdate.setDataOrigin(DataOrigin.EDIT);
    return addFacilityFileState(fileStateUpdate, referenceFacility);
  }

  public Facility syncFileState(Facility facilityFileState, Long version) {
    return mutexService.doWithLockedMutex(
        MUTEX_FACILITY_WRITE, () -> syncFileStateWhenLocked(facilityFileState, version));
  }

  private Facility syncFileStateWhenLocked(Facility facilityFileState, Long version) {
    Facility referenceFacility =
        facilityRepository
            .findReferenceFacilityByFileStateExternalId(facilityFileState.getExternalId())
            .orElseThrow(() -> new NotFoundException("Associated Reference Facility not found"));

    ValidationUtil.validateVersion(version, referenceFacility);

    if (!isFacilityFileStateOutdated(facilityFileState, referenceFacility)) {
      throw new BadRequestException(
          ErrorCode.CONFLICT, "File state and associated reference facility already match");
    }

    Facility updatedFileState = referenceFacility.cloneFromReferenceFacility();
    updatedFileState.setDataOrigin(DataOrigin.EDIT);
    return addFacilityFileState(updatedFileState, referenceFacility);
  }

  private void applyFacilityUpdate(Facility fileStateUpdate, Facility referenceFacility) {
    referenceFacility.setName(fileStateUpdate.getName());
    referenceFacility.setEmailAddresses(fileStateUpdate.getEmailAddresses());
    referenceFacility.setPhoneNumbers(fileStateUpdate.getPhoneNumbers());
    referenceFacility.setContactPersons(fileStateUpdate.getContactPersons());
    referenceFacility.setContactAddress(
        referenceFacility.cloneAddress(fileStateUpdate.getContactAddress()));
    referenceFacility.setDifferentBillingAddress(
        referenceFacility.cloneAddress(fileStateUpdate.getDifferentBillingAddress()));
    referenceFacility.setModifiedAt(Instant.now(clock));
    referenceFacility.setDataOrigin(DataOrigin.EDIT);
  }

  public Facility addFacilityFromExternalSource(Facility facilityFileState) {
    Facility referenceFacility = facilityFileState.cloneFromFileState();
    referenceFacility.setDataOrigin(DataOrigin.EXTERNAL);
    referenceFacility.setDeleteAt(null);
    Facility savedReferenceFacility = facilityRepository.save(referenceFacility);

    facilityFileState.setReferenceFacility(savedReferenceFacility);
    facilityFileState.setReferenceVersion(savedReferenceFacility.getVersion());
    facilityFileState.setDataOrigin(DataOrigin.EXTERNAL);

    return facilityRepository.save(facilityFileState);
  }

  public Facility updateReferenceFacility(
      UUID referenceDataId, long version, Facility referenceFacilityUpdate) {
    return mutexService.doWithLockedMutex(
        MUTEX_FACILITY_WRITE,
        () -> updateReferenceFacilityWhenLocked(referenceDataId, version, referenceFacilityUpdate));
  }

  private Facility updateReferenceFacilityWhenLocked(
      UUID referenceDataId, long version, Facility referenceFacilityUpdate) {

    Facility referenceFacility = getReferenceFacility(referenceDataId);
    ValidationUtil.validateVersion(version, referenceFacility);

    if (findMatchingReferenceFacility(referenceFacilityUpdate).isPresent()) {
      throw new AlreadyExistsException("Matching reference Facility already exists");
    }

    applyFacilityUpdate(referenceFacilityUpdate, referenceFacility);

    facilityRepository.flush();

    auditLogger.logEditReferenceData(referenceFacility);

    Facility fileState = referenceFacility.cloneFromReferenceFacility();
    return addFacilityFileState(fileState, referenceFacility);
  }

  private List<Facility> findAllFileStates(Set<UUID> fileStateIds) {
    return facilityRepository.findAllByExternalIdInAndReferenceFacilityIsNotNullOrderById(
        fileStateIds);
  }

  public GetFacilityDiffResponse getFacilityDiff(Facility facilityFileState) {
    Facility facilityReference =
        Hibernate.unproxy(facilityFileState.getReferenceFacility(), Facility.class);

    DiffResult<Facility> diff = FacilityDiffer.diff(facilityFileState, facilityReference);
    DiffDto<FacilityDetailsDto> facilityDetailsDiffDto =
        FacilityMapper.mapToDiffDto(diff, facilityFileState, facilityReference);

    List<FacilityContactPerson> lhs = facilityFileState.getContactPersons();
    List<FacilityContactPerson> rhs = facilityReference.getContactPersons();

    FacilityContactPersonsDiffWrapper contactPersonsDiff =
        FacilityDiffer.removeMatchingPairs(lhs, rhs);
    List<FacilityContactPersonDiffDto> contactPersonsDiffDto =
        FacilityMapper.mapContactPersonsDiffToApi(contactPersonsDiff);

    DiffDto<AddressDto> contactAddressDiffDto =
        AddressMapper.mapAddressDiffToApi(
            facilityFileState.getContactAddress(), facilityReference.getContactAddress());

    DiffDto<AddressDto> billingAddressDiffDto =
        AddressMapper.mapAddressDiffToApi(
            facilityFileState.getDifferentBillingAddress(),
            facilityReference.getDifferentBillingAddress());

    return new GetFacilityDiffResponse(
        facilityReference.getVersion(),
        facilityDetailsDiffDto,
        contactPersonsDiffDto,
        contactAddressDiffDto,
        billingAddressDiffDto);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import static de.eshg.base.centralfile.FacilityController.FACILITY_REFERENCE_NOT_FOUND;
import static de.eshg.base.centralfile.persistence.entity.DataOrigin.EXTERNAL;
import static de.eshg.base.util.SearchSpecificationUtil.getSimilarityThreshold;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.address.persistence.embeddable.*;
import de.eshg.base.centralfile.CentralFileAuditLogger;
import de.eshg.base.centralfile.api.DiffDto;
import de.eshg.base.centralfile.api.facility.*;
import de.eshg.base.centralfile.mapper.FacilityMapper;
import de.eshg.base.centralfile.persistence.entity.*;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.centralfile.persistence.repository.FacilitySearchSpecification;
import de.eshg.base.util.*;
import de.eshg.mutex.MutexService;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import jakarta.persistence.criteria.*;
import java.time.Clock;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.lang3.builder.DiffResult;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class FacilityService {
  private static final Logger log = LoggerFactory.getLogger(FacilityService.class);
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
    return searchReferenceFacilities(name, false);
  }

  public List<Facility> searchReferenceFacilitiesIncludingDeleted(String name) {
    return searchReferenceFacilities(name, true);
  }

  private List<Facility> searchReferenceFacilities(String name, boolean includeDeleted) {
    fuzzySearchHelper.setSimilarityThreshold(getSimilarityThreshold(name));
    FacilitySearchSpecification spec = new FacilitySearchSpecification(name, includeDeleted);
    return facilityRepository.findAll(spec);
  }

  public Facility addFacilityFileState(Facility facilityFileState, UUID referenceFacilityId) {
    return mutexService.doWithLockedMutex(
        MUTEX_FACILITY_WRITE,
        () -> addFacilityFileStateWhenLocked(facilityFileState, referenceFacilityId));
  }

  private Facility addFacilityFileStateWhenLocked(
      Facility facilityFileState, UUID referenceFacilityId) {
    Facility referenceFacility =
        findOrAddReferenceFacilityForAddFacilityFileState(facilityFileState, referenceFacilityId);

    return addFacilityFileState(facilityFileState, referenceFacility);
  }

  private Facility findOrAddReferenceFacilityForAddFacilityFileState(
      Facility facilityFileState, UUID referenceFacilityId) {

    if (referenceFacilityId != null) {
      return getReferenceFacility(referenceFacilityId);
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
    prepareFileStateToAddToDb(facilityFileState, referenceFacility);
    Facility savedFacilityFileState = facilityRepository.save(facilityFileState);

    auditLogger.logAddFileState(savedFacilityFileState);
    return savedFacilityFileState;
  }

  private static void prepareFileStateToAddToDb(Facility fileState, Facility referenceFacility) {
    fileState.setReferenceFacility(referenceFacility);
    fileState.setReferenceVersion(referenceFacility.getVersion());
    referenceFacility.setDeleteAt(null);
  }

  private Facility addFacilityForFileState(Facility facilityFileState) {
    Facility facility = facilityFileState.cloneFromFileState();
    Facility savedReferenceFacility = facilityRepository.save(facility);

    auditLogger.logAddReferenceData(savedReferenceFacility);
    return savedReferenceFacility;
  }

  public List<UUID> addFacilityFileStates(List<Facility> facilitiesToAdd) {
    return mutexService.doWithLockedMutex(
        MUTEX_FACILITY_WRITE, () -> addFacilityFileStatesWhenLocked(facilitiesToAdd));
  }

  private List<UUID> addFacilityFileStatesWhenLocked(List<Facility> facilitiesToAdd) {
    Set<FacilityPartialMatchAttributes> facilityPartialMatchAttributes =
        collectFacilityPartialMatchAttributes(facilitiesToAdd);
    List<Facility> potentialMatches =
        findFacilitiesByPartialMatchAttributes(facilityPartialMatchAttributes);

    Map<FacilityPartialMatchAttributes, Facility> lowestIdFacilities =
        createLowestIdMap(potentialMatches);

    for (Facility fileStateToAdd : facilitiesToAdd) {
      FacilityPartialMatchAttributes key = facilityPartialMatchAttributesOf(fileStateToAdd);
      Facility referenceFacility =
          lowestIdFacilities.computeIfAbsent(key, k -> addFacilityForFileState(fileStateToAdd));
      prepareFileStateToAddToDb(fileStateToAdd, referenceFacility);
      auditLogger.logAddFileState(fileStateToAdd);
    }
    facilityRepository.saveAll(facilitiesToAdd);

    return facilitiesToAdd.stream().map(Facility::getExternalId).toList();
  }

  private List<Facility> findFacilitiesByPartialMatchAttributes(
      Set<FacilityPartialMatchAttributes> facilityPartialMatchAttributes) {
    Specification<Facility> facilitySpecification =
        (root, query, cb) -> {
          Join<Facility, FacilityAddress> addressJoin =
              root.join(Facility_.contactAddress, JoinType.LEFT);
          List<Predicate> conjunctions = new ArrayList<>();

          for (FacilityPartialMatchAttributes facilityKeyAttribute :
              facilityPartialMatchAttributes) {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get(Facility_.name), facilityKeyAttribute.name()));
            predicates.add(cb.notEqual(root.get(Facility_.dataOrigin), DataOrigin.EXTERNAL));
            predicates.add(cb.isNull(root.get(Facility_.referenceFacility)));

            List<Predicate> addressPredicates =
                getAddressPredicates(
                    root, cb, facilityKeyAttribute.addressPartialMatchAttributes(), addressJoin);
            predicates.addAll(addressPredicates);

            conjunctions.add(cb.and(predicates.toArray(Predicate[]::new)));
          }

          assert query != null;
          query.orderBy(cb.asc(root.get(Facility_.id)));

          return cb.or(conjunctions.toArray(Predicate[]::new));
        };
    return facilityRepository.findAll(facilitySpecification);
  }

  private static List<Predicate> getAddressPredicates(
      Root<Facility> root,
      CriteriaBuilder cb,
      FacilityAddressPartialMatchAttributes addressAttribute,
      Join<Facility, FacilityAddress> addressJoin) {
    List<Predicate> addressPredicates = new ArrayList<>();

    if (addressAttribute == null) {
      addressPredicates.add(cb.isNull(root.get(Facility_.contactAddress)));
    } else {
      Path<Object> addressPath;

      switch (addressAttribute) {
        case DomesticFacilityAddressPartialMatchAttributes domesticAddress -> {
          addressPath = addressJoin.get(DomesticFacilityAddress_.EMBEDDED_DOMESTIC_ADDRESS);
          addressPredicates.add(
              cb.equal(
                  addressPath.get(EmbeddableDomesticAddress_.STREET), domesticAddress.street()));
          addressPredicates.add(
              cb.equal(
                  addressPath.get(EmbeddableDomesticAddress_.HOUSE_NUMBER),
                  domesticAddress.houseNumber()));
        }
        case PostboxFacilityAddressPartialMatchAttributes postboxAddress -> {
          addressPath = addressJoin.get(PostboxFacilityAddress_.EMBEDDED_POSTBOX_ADDRESS);
          addressPredicates.add(
              cb.equal(
                  addressPath.get(EmbeddablePostboxAddress_.POSTBOX), postboxAddress.postbox()));
        }
      }

      addressPredicates.add(
          cb.equal(addressPath.get(EmbeddableAddress_.COUNTRY), addressAttribute.country()));
      addressPredicates.add(
          cb.equal(addressPath.get(EmbeddableAddress_.CITY), addressAttribute.city()));
      addressPredicates.add(
          cb.equal(addressPath.get(EmbeddableAddress_.POSTAL_CODE), addressAttribute.postalCode()));
    }
    return addressPredicates;
  }

  private static Map<FacilityPartialMatchAttributes, Facility> createLowestIdMap(
      List<Facility> potentialMatches) {
    return potentialMatches.stream()
        .collect(
            Collectors.groupingBy(
                FacilityService::facilityPartialMatchAttributesOf,
                LinkedHashMap::new,
                Collectors.collectingAndThen(Collectors.toList(), List::getFirst)));
  }

  private static Set<FacilityPartialMatchAttributes> collectFacilityPartialMatchAttributes(
      List<Facility> fileStates) {
    return fileStates.stream()
        .map(FacilityService::facilityPartialMatchAttributesOf)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private static FacilityPartialMatchAttributes facilityPartialMatchAttributesOf(
      Facility fileState) {
    return new FacilityPartialMatchAttributes(
        fileState.getName(), facilityAddressPartialMatchAttributesOf(fileState));
  }

  private static FacilityAddressPartialMatchAttributes facilityAddressPartialMatchAttributesOf(
      Facility fileState) {
    FacilityAddress contactAddress = fileState.getContactAddress();
    if (contactAddress instanceof DomesticFacilityAddress domesticAddress) {
      return new DomesticFacilityAddressPartialMatchAttributes(
          contactAddress.getCountry(),
          contactAddress.getCity(),
          contactAddress.getPostalCode(),
          domesticAddress.getStreet(),
          domesticAddress.getHouseNumber());
    }

    if (contactAddress instanceof PostboxFacilityAddress postboxAddress) {
      return new PostboxFacilityAddressPartialMatchAttributes(
          contactAddress.getCountry(),
          postboxAddress.getCity(),
          postboxAddress.getPostalCode(),
          postboxAddress.getPostbox());
    }

    return null;
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
            f -> AddressMatcher.isAddressMatch(f.getContactAddress(), facility.getContactAddress()))
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
    if (facilityFileState.getDataOrigin() != EXTERNAL
        && FacilityMatcher.isFacilityMatch(fileStateUpdate, facilityFileState)) {
      log.debug(
          "Recognized no-op update. Returning original facility file state (id={})",
          facilityFileState.getId());
      return facilityFileState;
    }

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
    referenceFacility.setDataOrigin(EXTERNAL);
    referenceFacility.setDeleteAt(null);
    Facility savedReferenceFacility = facilityRepository.save(referenceFacility);

    facilityFileState.setReferenceFacility(savedReferenceFacility);
    facilityFileState.setReferenceVersion(savedReferenceFacility.getVersion());
    facilityFileState.setDataOrigin(EXTERNAL);

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

    boolean requiresUpdate =
        referenceFacility.getDataOrigin() == EXTERNAL
            || !FacilityMatcher.isFacilityMatch(referenceFacility, referenceFacilityUpdate);
    if (requiresUpdate) {
      if (findMatchingReferenceFacility(referenceFacilityUpdate).isPresent()) {
        throw new AlreadyExistsException("Matching reference Facility already exists");
      }

      applyFacilityUpdate(referenceFacilityUpdate, referenceFacility);

      facilityRepository.flush();

      auditLogger.logEditReferenceData(referenceFacility);
    } else {
      log.debug("Recognized no-op update. Returning a new file state");
    }

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

  public int deleteExpiredFileStatesAndReferences(Instant expirationTime) {
    return mutexService.doWithLockedMutex(
        MUTEX_FACILITY_WRITE, () -> deleteExpiredFileStatesAndReferencesWhenLocked(expirationTime));
  }

  private int deleteExpiredFileStatesAndReferencesWhenLocked(Instant expirationTime) {
    return facilityRepository.deleteByDeleteAtBefore(expirationTime);
  }
}

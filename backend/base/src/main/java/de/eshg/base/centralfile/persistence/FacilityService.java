/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import static de.eshg.base.centralfile.FacilityController.FACILITY_REFERENCE_NOT_FOUND;
import static de.eshg.base.centralfile.persistence.entity.DataOrigin.EXTERNAL;
import static de.eshg.base.util.SearchSpecificationUtil.getSimilarityThreshold;
import static java.util.Locale.ROOT;

import com.google.common.collect.Streams;
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
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import java.time.Clock;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.builder.DiffResult;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
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
  private final EntityManager entityManager;
  private final FacilityFileNumberService facilityFileNumberService;

  public FacilityService(
      FacilityRepository facilityRepository,
      FuzzySearchHelper fuzzySearchHelper,
      MutexService mutexService,
      CentralFileAuditLogger auditLogger,
      Clock clock,
      EntityManager entityManager,
      FacilityFileNumberService facilityFileNumberService) {
    this.facilityRepository = facilityRepository;
    this.mutexService = mutexService;
    this.auditLogger = auditLogger;
    this.fuzzySearchHelper = fuzzySearchHelper;
    this.clock = clock;
    this.entityManager = entityManager;
    this.facilityFileNumberService = facilityFileNumberService;
  }

  public List<Facility> searchReferenceFacilities(String name) {
    return searchReferenceFacilities(name, false, false);
  }

  public List<Facility> searchReferenceFacilitiesIncludingDeleted(String name) {
    return searchReferenceFacilities(name, true, false);
  }

  public List<Facility> searchReferenceFacilitiesIncludingDeletedAndExternal(String name) {
    return searchReferenceFacilities(name, true, true);
  }

  private List<Facility> searchReferenceFacilities(
      String name, boolean includeDeleted, boolean includeExternal) {
    fuzzySearchHelper.setSimilarityThreshold(getSimilarityThreshold(name));
    FacilitySearchSpecification spec =
        new FacilitySearchSpecification(name, includeDeleted, includeExternal);
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
      return findMatchingReferenceFacility(facilityFileState, false)
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

  public Optional<Facility> findMatchingReferenceFacility(
      Facility facility, boolean compareMainContact) {
    List<Facility> possibleMatches =
        facilityRepository.findReferenceFacilityByName(facility.getName());
    return possibleMatches.stream()
        .filter(f -> FacilityMatcher.isFacilityMatch(f, facility, compareMainContact))
        .collect(StreamUtil.toSingleOptionalElement());
  }

  public static boolean isFacilityFileStateOutdated(
      Facility facilityFileState, Facility referenceFacility) {
    return !FacilityMatcher.isFacilityMatch(referenceFacility, facilityFileState, false);
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
        && FacilityMatcher.isFacilityMatch(fileStateUpdate, facilityFileState, true)) {
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

    if (findMatchingReferenceFacility(fileStateUpdate, true).isPresent()) {
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
    reapplyMainContactFlag(updatedFileState, facilityFileState);
    updatedFileState.setDataOrigin(DataOrigin.EDIT);
    return addFacilityFileState(updatedFileState, referenceFacility);
  }

  private void reapplyMainContactFlag(Facility updatedFileState, Facility originalFileState) {
    Optional<FacilityContactPerson> optionalMainContactPerson =
        originalFileState.getContactPersons().stream()
            .filter(FacilityContactPerson::isMainContact)
            .findFirst();

    if (optionalMainContactPerson.isEmpty()) {
      return;
    }
    FacilityContactPerson mainContactPerson = optionalMainContactPerson.get();

    Optional<FacilityContactPerson> optionalFullMatch =
        updatedFileState.getContactPersons().stream()
            .filter(cp -> FacilityMatcher.isContactPersonMatch(mainContactPerson, cp, false))
            .findFirst();

    if (optionalFullMatch.isPresent()) {
      optionalFullMatch.get().setMainContact(true);
    } else {
      Optional<FacilityContactPerson> optionalNameMatch =
          updatedFileState.getContactPersons().stream()
              .filter(cp -> FacilityMatcher.isContactPersonMatchNameMatch(mainContactPerson, cp))
              .findFirst();
      optionalNameMatch.ifPresent(
          facilityContactPerson -> facilityContactPerson.setMainContact(true));
    }
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

  public String getFacilityFileNumber(UUID fileStateId, String method) {
    Facility facility = facilityRepository.findFileStateByExternalId(fileStateId).orElseThrow();

    switch (method) {
      case "DEFAULT":
        return facilityFileNumberService.calculateFacilityFileNumberDefault();
      case "INSPECTION_FRANKFURT":
        FacilityAddress address = facility.getContactAddress();

        if (address instanceof DomesticFacilityAddress domesticFacilityAddress) {
          return facilityFileNumberService.calculateFacilityFileNumberForInspectionFrankfurt(
              domesticFacilityAddress.getStreet(),
              domesticFacilityAddress.getHouseNumber(),
              domesticFacilityAddress.getPostalCode());
        } else {
          return null;
        }
      default:
        throw new IllegalArgumentException("Unknown file number calculation method: " + method);
    }
  }

  private Facility updateReferenceFacilityWhenLocked(
      UUID referenceDataId, long version, Facility referenceFacilityUpdate) {

    Facility referenceFacility = getReferenceFacility(referenceDataId);
    ValidationUtil.validateVersion(version, referenceFacility);

    boolean requiresUpdate =
        referenceFacility.getDataOrigin() == EXTERNAL
            || !FacilityMatcher.isFacilityMatch(referenceFacility, referenceFacilityUpdate, false);
    if (requiresUpdate) {
      if (findMatchingReferenceFacility(referenceFacilityUpdate, false).isPresent()) {
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

  public GetFacilityFileStatesFilteredResponse getFacilityFileStatesFiltered(
      GetFacilityFileStatesFilteredRequest request) {

    List<Sort.Order> orderList = mapSort(request.sort());

    return findFacilitiesFiltered(
        request.fileStateIds(),
        request.name(),
        request.postalCode(),
        request.city(),
        request.street(),
        request.pageNumber(),
        request.pageSize(),
        orderList);
  }

  private List<Sort.Order> mapSort(List<String> sort) {
    if (sort == null) {
      return Collections.emptyList();
    }
    return sort.stream()
        .map(
            s -> {
              String[] splitString = s.split("\\|", 2);
              if (splitString.length < 2 || splitString[1].equals("asc")) {
                return Sort.Order.asc(splitString[0]);
              } else if (splitString[1].equals("desc")) {
                return Sort.Order.desc(splitString[0]);
              } else {
                throw new BadRequestException(
                    ErrorCode.BAD_REQUEST, "Bad sorting direction: " + splitString[1]);
              }
            })
        .toList();
  }

  private List<Predicate> buildPredicates(
      CriteriaBuilder cb,
      RootAndJoins rootAndJoins,
      @Nullable List<UUID> fileStateIds,
      @Nullable String name,
      @Nullable String postalCode,
      @Nullable String city,
      @Nullable String street) {
    List<Predicate> predicates = new ArrayList<>();

    if (fileStateIds != null && !fileStateIds.isEmpty()) {
      predicates.add(rootAndJoins.facilityRoot.get(Facility_.externalId).in(fileStateIds));
    }
    if (name != null) {
      predicates.add(
          cb.like(
              cb.lower(rootAndJoins.facilityRoot.get(Facility_.name)),
              prepareStringForLike(name),
              '\\'));
    }
    if (postalCode != null) {
      predicates.add(
          cb.like(
              cb.lower(
                  rootAndJoins.embeddableAddressJoin.get(EmbeddableDomesticAddress_.postalCode)),
              prepareStringForLike(postalCode),
              '\\'));
    }
    if (city != null) {
      predicates.add(
          cb.like(
              cb.lower(rootAndJoins.embeddableAddressJoin.get(EmbeddableDomesticAddress_.city)),
              prepareStringForLike(city),
              '\\'));
    }
    if (street != null) {
      predicates.add(
          cb.like(
              cb.lower(rootAndJoins.embeddableAddressJoin.get(EmbeddableDomesticAddress_.street)),
              prepareStringForLike(street),
              '\\'));
    }
    return predicates;
  }

  private static String prepareStringForLike(String s) {
    return "%"
        + s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_").toLowerCase(ROOT)
        + "%";
  }

  private record RootAndJoins(
      Root<Facility> facilityRoot,
      Join<Facility, DomesticFacilityAddress> addressJoin,
      Join<DomesticFacilityAddress, EmbeddableDomesticAddress> embeddableAddressJoin) {}

  private RootAndJoins createRootAndJoins(CriteriaQuery<?> cq) {
    Root<Facility> facilityRoot = cq.from(Facility.class);
    Join<Facility, DomesticFacilityAddress> addressJoin =
        facilityRoot.join(Facility_.CONTACT_ADDRESS, JoinType.LEFT);
    Join<DomesticFacilityAddress, EmbeddableDomesticAddress> embeddableAddressJoin =
        addressJoin.join(DomesticFacilityAddress_.EMBEDDED_DOMESTIC_ADDRESS, JoinType.LEFT);

    return new RootAndJoins(facilityRoot, addressJoin, embeddableAddressJoin);
  }

  private GetFacilityFileStatesFilteredResponse findFacilitiesFiltered(
      @Nullable List<UUID> fileStateIds,
      @Nullable String name,
      @Nullable String postalCode,
      @Nullable String city,
      @Nullable String street,
      @Nullable Integer pageNumber,
      @Nullable Integer pageSize,
      @Nullable List<Sort.Order> orders) {

    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    // We have one query for fetching the facilities in the page and one for fetching the total
    // number
    CriteriaQuery<FacilityView> cq = cb.createQuery(FacilityView.class);
    CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);

    // We create the root and joins for both queries.
    RootAndJoins rootAndJoins = createRootAndJoins(cq);
    RootAndJoins rootAndJoinsForCount = createRootAndJoins(countQuery);

    // We create the filter predicates for both queries.
    List<Predicate> predicates =
        buildPredicates(cb, rootAndJoins, fileStateIds, name, postalCode, city, street);
    List<Predicate> predicatesForCount =
        buildPredicates(cb, rootAndJoinsForCount, fileStateIds, name, postalCode, city, street);

    cq.select(
        cb.construct(
            FacilityView.class,
            rootAndJoins.facilityRoot,
            rootAndJoins.addressJoin,
            rootAndJoins.embeddableAddressJoin));
    cq.where(cb.and(predicates.toArray(Predicate[]::new)));

    if (orders != null && !orders.isEmpty()) {
      cq.orderBy(
          Streams.concat(
                  orders.stream().map(order -> getOrderFromSortOrder(cb, order, rootAndJoins)),
                  Stream.of(cb.asc(rootAndJoins.facilityRoot.get(Facility_.id))))
              .toList());
    } else {
      cq.orderBy(cb.asc(rootAndJoins.facilityRoot.get(Facility_.id)));
    }

    countQuery.select(cb.count(rootAndJoinsForCount.facilityRoot));
    countQuery.where(cb.and(predicatesForCount.toArray(Predicate[]::new)));

    TypedQuery<FacilityView> query = entityManager.createQuery(cq);

    long totalCount;
    if (pageNumber != null && pageSize != null) {
      query.setFirstResult(pageNumber * pageSize).setMaxResults(pageSize);

      // We only need to actually call the count query if we paginate.
      totalCount = entityManager.createQuery(countQuery).getSingleResult();
    } else {
      // If we don't paginate, the total number is just the number of rows we get.
      totalCount = query.getResultList().size();
    }

    return new GetFacilityFileStatesFilteredResponse(
        totalCount,
        query.getResultList().stream()
            .map(FacilityView::facility)
            .map(
                facility ->
                    FacilityMapper.mapFacilityToGetFacilityFileStateResponse(facility, null))
            .toList());
  }

  private Order getOrderFromSortOrder(
      CriteriaBuilder cb, Sort.Order order, RootAndJoins rootAndJoins) {
    return order.isAscending()
        ? cb.asc(
            getFromFromOrderProperty(order.getProperty(), rootAndJoins).get(order.getProperty()))
        : cb.desc(
            getFromFromOrderProperty(order.getProperty(), rootAndJoins).get(order.getProperty()));
  }

  private From<?, ?> getFromFromOrderProperty(String property, RootAndJoins rootAndJoins) {
    if ("name".equals(property)) {
      return rootAndJoins.facilityRoot;
    } else {
      return rootAndJoins.embeddableAddressJoin;
    }
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import static de.eshg.lib.aggregation.AggregationHelper.aggregateErrorResponses;
import static de.eshg.lib.keycloak.CitizenPermissionRole.BUND_ID_USER;
import static de.eshg.lib.keycloak.CitizenPermissionRole.MUK_USER;

import de.eshg.base.bundid.persistence.BundIdPersonLinkService;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.gdpr.api.GetGdprProcedureFileStateIdsResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureResponse;
import de.eshg.base.gdpr.persistence.CentralFileIdWrapper;
import de.eshg.base.gdpr.persistence.DownloadPackage;
import de.eshg.base.gdpr.persistence.GdprDownload;
import de.eshg.base.gdpr.persistence.GdprFacility;
import de.eshg.base.gdpr.persistence.GdprPerson;
import de.eshg.base.gdpr.persistence.GdprProcedure;
import de.eshg.base.gdpr.persistence.GdprProcedureStatus;
import de.eshg.base.gdpr.persistence.GdprProcedureType;
import de.eshg.base.gdpr.persistence.GdprProcedure_;
import de.eshg.base.gdpr.persistence.IdentificationData;
import de.eshg.base.gdpr.persistence.repository.GdprDownloadRepository;
import de.eshg.base.gdpr.persistence.repository.GdprProcedureRepository;
import de.eshg.base.keycloak.CitizenKeycloakClient;
import de.eshg.base.muk.persistence.MukFacilityLinkService;
import de.eshg.base.pdf.gdpr.GdprRightToObjectLetterGenerator;
import de.eshg.base.util.PaginationUtil;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.domain.model.serialization.NormalizeSequenceIdCustomizer;
import de.eshg.domain.model.serialization.SerializationService;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.common.BusinessModuleCapability;
import de.eshg.lib.keycloak.CitizenUserAttribute;
import de.eshg.lib.procedure.model.gdpr.DeleteDownloadPackagesRequest;
import de.eshg.rest.service.error.AggregationException;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.validation.ValidationUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GdprProcedureService {
  public static final Set<GdprProcedureType> TYPES_REQUIRING_BROADCAST =
      Set.of(GdprProcedureType.RIGHT_TO_ERASURE, GdprProcedureType.RIGHT_OF_ACCESS);

  private static final String AUDITLOG_CATEGORY = "DSGVO";

  private static final Logger log = LoggerFactory.getLogger(GdprProcedureService.class);
  private final GdprProcedureRepository repository;
  private final PersonRepository personRepository;
  private final FacilityRepository facilityRepository;
  private final GdprDownloadRepository downloadRepository;
  private final SerializationService serializationService;
  private final MukFacilityLinkService mukFacilityLinkService;
  private final BundIdPersonLinkService bundIdPersonLinkService;
  private final AuditLogger auditLogger;
  private final Clock clock;
  private final GdprRightToObjectLetterGenerator rightToObjectLetterGenerator;
  private final EntityManager entityManager;
  private final CitizenKeycloakClient citizenKeycloakClient;
  private final Validator validator;
  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;

  private static Specification<GdprProcedure> hasType(GdprProcedureType type) {
    if (type == null) {
      return (root, query, builder) -> builder.and();
    }
    return (root, query, cb) -> cb.equal(root.get(GdprProcedure_.type), type);
  }

  public GdprProcedureService(
      GdprProcedureRepository procedureRepository,
      PersonRepository personRepository,
      FacilityRepository facilityRepository,
      MukFacilityLinkService mukFacilityLinkService,
      BundIdPersonLinkService bundIdPersonLinkService,
      GdprDownloadRepository downloadRepository,
      SerializationService serializationService,
      AuditLogger auditLogger,
      Clock clock,
      GdprRightToObjectLetterGenerator rightToObjectLetterGenerator,
      EntityManager entityManager,
      CitizenKeycloakClient citizenKeycloakClient,
      Validator validator,
      BusinessModuleAggregationHelper businessModuleAggregationHelper) {
    this.repository = procedureRepository;
    this.personRepository = personRepository;
    this.facilityRepository = facilityRepository;
    this.mukFacilityLinkService = mukFacilityLinkService;
    this.bundIdPersonLinkService = bundIdPersonLinkService;
    this.downloadRepository = downloadRepository;
    this.serializationService = serializationService;
    this.auditLogger = auditLogger;
    this.clock = clock;
    this.rightToObjectLetterGenerator = rightToObjectLetterGenerator;
    this.entityManager = entityManager;
    this.citizenKeycloakClient = citizenKeycloakClient;
    this.validator = validator;
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
  }

  public GdprProcedure addFromCitizenPortal(GdprProcedure procedure) {
    procedure.setStatus(GdprProcedureStatus.DRAFT);
    GdprProcedure saved = repository.save(procedure);
    addLinkedCentralFileDatasets(procedure, saved);
    writeAuditLog("DSGVO Vorgang anlegen", mapAuditLog(saved));
    return saved;
  }

  private void addLinkedCentralFileDatasets(GdprProcedure procedure, GdprProcedure saved) {
    switch (procedure.getIdentificationData()) {
      case GdprFacility gdprFacility when gdprFacility.getDataTransmitterPseudonymId() != null ->
          mukFacilityLinkService
              .getReferenceFacilityGracefully(gdprFacility.getDataTransmitterPseudonymId())
              .map(GdprProcedureService::toCentralFileWrapper)
              .ifPresent(saved::addCentralFileIds);
      case GdprPerson gdprPerson when gdprPerson.getBpk2() != null ->
          bundIdPersonLinkService
              .getReferencePersonGraceFully(gdprPerson.getBpk2())
              .map(GdprProcedureService::toCentralFileWrapper)
              .ifPresent(saved::addCentralFileIds);
      case GdprFacility ignored ->
          throw new IllegalArgumentException(
              "Missing dataTransmitterPseudonymId for procedure from citizen portal");
      case GdprPerson ignored ->
          throw new IllegalArgumentException("Missing bpk2 for procedure from citizen portal");
      default -> throw new IllegalStateException("Unexpected value for identification data");
    }
  }

  public GdprProcedure addFromEmployeePortal(GdprProcedure procedure) {
    procedure.setStatus(GdprProcedureStatus.DRAFT);
    GdprProcedure saved = repository.save(procedure);
    writeAuditLog("DSGVO Vorgang anlegen", mapAuditLog(saved));
    return saved;
  }

  private static List<CentralFileIdWrapper> toCentralFileWrapper(EntityWithExternalId reference) {
    CentralFileIdWrapper centralFileIdWrapper = new CentralFileIdWrapper();
    centralFileIdWrapper.setCentralFileId(reference.getExternalId());
    return List.of(centralFileIdWrapper);
  }

  public GdprProcedure getGdprProcedureFromDb(UUID id) {
    GdprProcedure procedure =
        findByExternalId(id).orElseThrow(GdprProcedureService::notFoundException);
    validatePermissionToAccessGdprProcedure(procedure.getIdentificationData(), true);
    return procedure;
  }

  public Optional<GdprProcedure> findByExternalId(UUID id) {
    return repository.findByExternalId(id);
  }

  public Optional<UUID> findFirstByDownloadIds(Set<UUID> id) {
    return repository.findFirstByDownloadIds(id);
  }

  public Page<GdprProcedure> findAll(
      GdprProcedureType gdprProcedureType, PaginationUtil.PageSpec pageSpec) {
    Specification<GdprProcedure> specification =
        Specification.allOf(hasType(gdprProcedureType), orderByStatusAndPageSpec(pageSpec));

    return repository.findAll(
        specification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
  }

  private Specification<GdprProcedure> orderByStatusAndPageSpec(PaginationUtil.PageSpec pageSpec) {
    return (root, query, builder) -> {
      CriteriaBuilder.Case<Integer> statusCase = builder.selectCase();
      Path<GdprProcedureStatus> statusPath = root.get(GdprProcedure_.status);
      Expression<Integer> statusIndex =
          statusCase
              .when(builder.equal(statusPath, GdprProcedureStatus.CLOSED), 1)
              .when(builder.equal(statusPath, GdprProcedureStatus.ABORTED), 1)
              .otherwise(0);
      query.orderBy(getGdprProcedureOrder(root, pageSpec, builder, statusIndex));
      return builder.and();
    };
  }

  private static List<Order> getGdprProcedureOrder(
      Root<GdprProcedure> root,
      PaginationUtil.PageSpec pageSpec,
      CriteriaBuilder builder,
      Expression<Integer> statusIndex) {
    Path<Object> sortProperty = root.get(pageSpec.order().getProperty());
    Path<Long> uniqueSecondarySortProperty = root.get(BaseEntity_.id);
    if (pageSpec.order().isAscending()) {
      return List.of(
          builder.asc(statusIndex),
          builder.asc(sortProperty),
          builder.asc(uniqueSecondarySortProperty));
    } else {
      return List.of(
          builder.desc(statusIndex),
          builder.desc(sortProperty),
          builder.desc(uniqueSecondarySortProperty));
    }
  }

  public List<GdprProcedure> findGdprProceduresLinkedWithSelfUser() {
    UserRepresentation representation = citizenKeycloakClient.getSelfUser().toRepresentation();

    Map<String, List<String>> attributes = representation.getAttributes();
    if (representation.getAttributes() == null) {
      log.error(
          "No bpk2 or mukDataTransmitterPseudonymId could be extracted from user {}",
          representation.getId());
      throw new IllegalStateException("No user attributes found");
    }

    if (attributes.containsKey(CitizenUserAttribute.BUND_ID_B_PK_2.getKey())) {
      String bpk2 = attributes.get(CitizenUserAttribute.BUND_ID_B_PK_2.getKey()).getFirst();
      return repository.findByAssociatedBpk2(bpk2);
    }

    if (attributes.containsKey(CitizenUserAttribute.MUK_DATA_TRANSMITTER_PSEUDONYM_ID.getKey())) {
      String dataTransmitterPseudonymId =
          attributes
              .get(CitizenUserAttribute.MUK_DATA_TRANSMITTER_PSEUDONYM_ID.getKey())
              .getFirst();
      return repository.findByAssociatedDataTransmitterPseudonymId(dataTransmitterPseudonymId);
    }

    log.error(
        "No bpk2 or mukDataTransmitterPseudonymId could be extracted from user {}",
        representation.getId());
    throw new IllegalStateException("No bpk2 or dataTransmitterPseudonymId found");
  }

  public GdprProcedure addCentralFileIdsToGdprProcedure(
      List<CentralFileIdWrapper> centralFileIds, UUID gdprProcedureId, long version) {
    GdprProcedure procedure = getGdprProcedureForUpdate(gdprProcedureId);

    ValidationUtil.validateVersion(version, procedure);
    throwIfProcedureIsNoDraft(procedure);
    throwIfCentralFileIdAlreadyExists(centralFileIds, procedure);

    entityManager.lock(procedure, LockModeType.PESSIMISTIC_FORCE_INCREMENT);

    switch (procedure.getIdentificationData()) {
      case GdprFacility gdprFacility when gdprFacility.getDataTransmitterPseudonymId() != null -> {
        String dataTransmitterPseudonymId = gdprFacility.getDataTransmitterPseudonymId();
        Optional<Facility> facility =
            mukFacilityLinkService.getReferenceFacilityGracefully(dataTransmitterPseudonymId);
        if (facility.isEmpty() && !centralFileIds.isEmpty()) {
          facilityRepository
              .findByExternalId(centralFileIds.getFirst().getCentralFileId())
              .ifPresent(
                  value ->
                      mukFacilityLinkService.addMukFacilityLink(dataTransmitterPseudonymId, value));
        }
      }
      case GdprPerson gdprPerson when gdprPerson.getBpk2() != null -> {
        String bpk2 = gdprPerson.getBpk2();
        Optional<Person> person = bundIdPersonLinkService.getReferencePersonGraceFully(bpk2);
        if (person.isEmpty() && !centralFileIds.isEmpty()) {
          personRepository
              .findByExternalId(centralFileIds.getFirst().getCentralFileId())
              .ifPresent(value -> bundIdPersonLinkService.addBundIdPersonLink(bpk2, value));
        }
      }
      case GdprFacility ignored -> {}
      case GdprPerson ignored -> {}
      default -> throw new IllegalStateException("Unexpected value for identification data");
    }

    procedure.addCentralFileIds(centralFileIds);

    writeAuditLog("StammdatenIDs hinzufügen", mapAuditLog(procedure));
    return procedure;
  }

  private static void throwIfProcedureIsNoDraft(GdprProcedure procedure) {
    if (procedure.getStatus() != GdprProcedureStatus.DRAFT) {
      throw new BadRequestException(
          "Cannot add centralFileIds: Gdpr Procedure is not in Draft Status");
    }
  }

  private static void throwIfCentralFileIdAlreadyExists(
      List<CentralFileIdWrapper> centralFileIds, GdprProcedure procedure) {
    List<UUID> existingIds =
        procedure.getCentralFileIdsWrappers().stream()
            .map(CentralFileIdWrapper::getCentralFileId)
            .toList();
    for (CentralFileIdWrapper centralFileId : centralFileIds) {
      if (existingIds.contains(centralFileId.getCentralFileId())) {
        throw new AlreadyExistsException("Some centralFileIds already exist");
      }
    }
  }

  public byte[] getCentralFileDownloadPackage(UUID id) {
    GdprProcedure procedure = getGdprProcedureFromDb(id);
    validatePermissionToAccessGdprProcedure(procedure.getIdentificationData(), false);

    DownloadPackage centralFileDownload = procedure.getCentralFileDownload();
    if (centralFileDownload == null) {
      throw new BadRequestException("Central file download not present.");
    }

    writeAuditLog("Stammdaten Paket herunterladen", mapAuditLog(procedure));
    return centralFileDownload.getContent();
  }

  private void validatePermissionToAccessGdprProcedure(
      IdentificationData identificationData, boolean allowEmployeeFullAccess) {
    if (allowEmployeeFullAccess && CurrentUserHelper.isEmployee()) {
      return;
    }
    switch (identificationData) {
      case null -> throw new IllegalStateException("Identification data null");
      case GdprPerson p -> validateUser(p);
      case GdprFacility f -> validateUser(f);
      default ->
          throw new IllegalStateException(
              "Unexpected type of IdentificationData: " + identificationData.getClass());
    }
  }

  private void validateUser(GdprPerson p) {
    if (StringUtils.isEmpty(p.getBpk2())) {
      validateEmployee();
    } else {
      validateCitizen(p);
    }
  }

  private void validateUser(GdprFacility f) {
    if (StringUtils.isEmpty(f.getDataTransmitterPseudonymId())) {
      validateEmployee();
    } else {
      validateFacility(f);
    }
  }

  private void validateEmployee() {
    if (!CurrentUserHelper.isEmployee()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Current user is not an employee");
    }
  }

  private void validateCitizen(GdprPerson p) {
    if (!CurrentUserHelper.currentUserHasRole(BUND_ID_USER)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Current user is not a bund-id user");
    }
    Optional<String> bpk2Gracefully = CurrentUserHelper.getBundIdGracefully();
    if (bpk2Gracefully.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bund-id user does not have a bpk2");
    }
    if (!p.getBpk2().equals(bpk2Gracefully.get())) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN,
          "Bund-id bpk2 of current user and of given gdpr procedure do not match");
    }
  }

  private void validateFacility(GdprFacility f) {
    if (!CurrentUserHelper.currentUserHasRole(MUK_USER)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Current user is not a muk user");
    }
    Optional<String> mukIdGracefully = CurrentUserHelper.getMukIdGracefully();
    if (mukIdGracefully.isEmpty()) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Muk user does not have a dataTransmitterPseudonymId");
    }
    if (!f.getDataTransmitterPseudonymId().equals(mukIdGracefully.get())) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN,
          "Muk dataTransmitterPseudonymId of current user and of given gdpr procedure do not match");
    }
  }

  public IdentificationData getCitizenSelfUserIdentificationData() {
    UserRepresentation representation = citizenKeycloakClient.getSelfUser().toRepresentation();

    if (containsAttribute(representation, CitizenUserAttribute.BUND_ID_B_PK_2)) {
      PersonIdentificationDataForValidation dataDto =
          BundIdAttributesMapper.mapFromKeycloak(representation);
      validateIdentificationData(dataDto);

      return BundIdAttributesMapper.mapToDm(dataDto);
    }

    if (containsAttribute(representation, CitizenUserAttribute.MUK_DATA_TRANSMITTER_PSEUDONYM_ID)) {
      FacilityIdentificationDataForValidation dataDto =
          MukAttributesMapper.mapFromKeycloak(representation);
      validateIdentificationData(dataDto);

      return MukAttributesMapper.mapToDm(dataDto);
    }

    throw new BadRequestException("Unknown citizen user type");
  }

  private static boolean containsAttribute(
      UserRepresentation representation, CitizenUserAttribute attribute) {
    Map<String, List<String>> userAttributes = representation.getAttributes();

    return userAttributes != null && userAttributes.containsKey(attribute.getKey());
  }

  private void validateIdentificationData(IdentificationDataForValidation dataDto) {
    Set<ConstraintViolation<Object>> violations = validator.validate(dataDto);

    if (!violations.isEmpty()) {
      throw new ConstraintViolationException(getErrorMessageForDataType(dataDto), violations);
    }
  }

  private static String getErrorMessageForDataType(IdentificationDataForValidation dataDto) {
    return switch (dataDto) {
      case PersonIdentificationDataForValidation ignored ->
          "BundId user attributes constraints violated";
      case FacilityIdentificationDataForValidation ignored ->
          "MUK user attributes constraints violated";
    };
  }

  public GdprProcedure getGdprProcedureForUpdate(UUID gdprProcedureId) {
    return repository
        .findByExternalIdForUpdate(gdprProcedureId)
        .orElseThrow(GdprProcedureService::notFoundException);
  }

  private static NotFoundException notFoundException() {
    return new NotFoundException("GdprProcedure with given id not found.");
  }

  public void addGdprDownloads(UUID id, @NotNull Set<UUID> downloadIdsToAdd) {
    log.info("Adding downloadIds={} to GdprProcedure(id={})", downloadIdsToAdd, id);
    GdprProcedure procedure = getGdprProcedureForUpdate(id);
    List<UUID> existingDownloads = downloadRepository.findExistingDownloadIds(downloadIdsToAdd);

    if (!existingDownloads.isEmpty()) {
      throw new AlreadyExistsException(
          "Download ids %s already exist.".formatted(existingDownloads));
    }

    for (UUID uuid : downloadIdsToAdd) {
      GdprDownload download = new GdprDownload();
      download.setDownloadId(uuid);
      procedure.addDownload(download);

      writeAuditLog("Datenpaket hinzufügen", mapAuditLog(procedure, uuid));
    }

    log.info("Added downloadIds={} to GdprProcedure(id={})", downloadIdsToAdd, id);
  }

  public void deleteGdprDownloads(UUID id, @NotNull Set<UUID> downloadIdsToDelete) {
    log.info("Deleting downloadIds={} of GdprProcedure(id={})", downloadIdsToDelete, id);
    GdprProcedure procedure = getGdprProcedureForUpdate(id);

    for (UUID uuid : downloadIdsToDelete) {
      procedure.deleteDownload(uuid);
      writeAuditLog("Datenpaket löschen", mapAuditLog(procedure, uuid));
    }

    log.info("Deleted downloadIds={} of GdprProcedure(id={})", downloadIdsToDelete, id);
  }

  public void updateStatus(GdprProcedure gdprProcedure, GdprProcedureStatus newStatus) {
    log.info("Setting status of GdprProcedure(id={}) to {}.", gdprProcedure.getId(), newStatus);
    if ((newStatus == GdprProcedureStatus.CLOSED || newStatus == GdprProcedureStatus.ABORTED)
        && newStatus != gdprProcedure.getStatus()) {
      gdprProcedure.setClosedAt(Instant.now(clock));
    }
    gdprProcedure.setStatus(newStatus);
    repository.flush();

    writeAuditLog("Status aktualisieren", mapAuditLog(gdprProcedure));
  }

  public void createDownloadPackageForCentralFiles(GdprProcedure procedure) {
    if (procedure.getCentralFileIdsWrappers().isEmpty()) {
      log.info(
          "No linked central file IDs found for GdprProcedure(id={}) not creating download package.",
          procedure.getId());
      return;
    }

    log.info("Creating DownloadPackage for GdprProcedure(id={})", procedure.getId());

    byte[] zipped = serializeCentralFiles(procedure);
    DownloadPackage downloadPackage = new DownloadPackage();
    downloadPackage.setContent(zipped);
    procedure.setCentralFileDownload(downloadPackage);
    writeAuditLog("Stammdatenpaket erzeugen", mapAuditLog(procedure));
  }

  private byte[] serializeCentralFiles(GdprProcedure procedure) {
    List<UUID> refExternalIds =
        procedure.getCentralFileIdsWrappers().stream()
            .map(CentralFileIdWrapper::getCentralFileId)
            .toList();

    List<UUID> personFileStateIds =
        personRepository.findAllFileStateIdsByReferencePerson(refExternalIds);

    List<Person> personFileStates =
        personRepository.findAllByExternalIdInAndReferencePersonIsNotNullOrderById(
            personFileStateIds);

    List<UUID> facilityFileStateIds =
        facilityRepository.findAllFileStateIdsByReferenceFacility(refExternalIds);

    List<Facility> facilityFileStates =
        facilityRepository.findAllByExternalIdInAndReferenceFacilityIsNotNullOrderById(
            facilityFileStateIds);

    List<EntityWithExternalId> fileStates = new ArrayList<>();
    fileStates.addAll(personFileStates);
    fileStates.addAll(facilityFileStates);

    return serializationService.toNestedZip(
        "Sachstand-", fileStates, new NormalizeSequenceIdCustomizer());
  }

  public void writeAuditLog(String operationName, Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    auditLogger.log(AUDITLOG_CATEGORY, operationName, attributes);
  }

  public Map<String, String> mapAuditLog(GdprProcedure procedure) {
    return Map.of("DSGVO Vorgang ID", procedure.getExternalId().toString());
  }

  private Map<String, String> mapAuditLog(GdprProcedure procedure, UUID downloadId) {
    Map<String, String> mappedAuditLog = new HashMap<>(mapAuditLog(procedure));
    mappedAuditLog.putIfAbsent("Download ID", downloadId.toString());
    return mappedAuditLog;
  }

  public void deleteProcedure(UUID gdprProcedureId) {
    log.info("Deleting GDPR procedure ID: {}...", gdprProcedureId);

    Optional<GdprProcedure> optionalProcedure = findByExternalId(gdprProcedureId);

    if (optionalProcedure.isEmpty()) {
      log.debug("GdprProcedure with ID {} not found, skipping deletion.", gdprProcedureId);
      return;
    }

    GdprProcedure procedure = optionalProcedure.get();
    deleteProcedureRelatedDataInModulesIfNecessary(procedure);
    deleteProcedureInDb(procedure);
    log.info("Successfully deleted GDPR procedure ID: {}", procedure.getExternalId());
  }

  private void deleteProcedureInDb(GdprProcedure procedure) {
    log.info("Deleting GDPR procedure in Db with ID: {}", procedure.getExternalId());
    repository.deleteByExternalId(procedure.getExternalId());
    writeAuditLog("Löschung", mapAuditLog(procedure));
  }

  private void deleteProcedureRelatedDataInModulesIfNecessary(GdprProcedure procedure) {
    if (TYPES_REQUIRING_BROADCAST.contains(procedure.getType())) {
      deleteDataInModules(procedure);
    }
  }

  private void deleteDataInModules(GdprProcedure procedure) {
    UUID gdprProcedureId = procedure.getExternalId();
    log.info("Deleting data in modules for GDPR procedure ID: {}...", gdprProcedureId);
    throwExceptionOnError(broadcastDelete(gdprProcedureId, getDownloadIds(procedure)));
    log.info("Data successfully deleted in modules for GDPR procedure ID: {}", gdprProcedureId);
  }

  private static void throwExceptionOnError(List<ClientResponse<Void>> responses) {
    List<ErrorResponseWithLocation> errors = aggregateErrorResponses(responses);
    if (!errors.isEmpty()) {
      throw new AggregationException(
          ErrorCode.AGGREGATION_EXCEPTION, "Could not delete data in one or more modules.");
    }
  }

  private List<ClientResponse<Void>> broadcastDelete(UUID gdprProcedureId, List<UUID> downloadIds) {
    return businessModuleAggregationHelper.requestFromBusinessModules(
        null,
        BusinessModuleCapability.PROCEDURES,
        client -> {
          client.deleteGdprValidationTaskAndDownloadPackages(
              gdprProcedureId, new DeleteDownloadPackagesRequest(downloadIds));
          return null;
        });
  }

  private List<UUID> getDownloadIds(GdprProcedure procedure) {
    if (procedure.getType() == GdprProcedureType.RIGHT_OF_ACCESS
        && procedure.getDownloads() != null) {
      return procedure.getDownloads().stream().map(GdprDownload::getDownloadId).toList();
    }
    return List.of();
  }

  public Set<UUID> fetchFileStateIdsFromDb(GdprProcedure procedure) {
    Set<UUID> fileStateIds = new LinkedHashSet<>();
    List<UUID> centralFileIds =
        procedure.getCentralFileIdsWrappers().stream()
            .map(CentralFileIdWrapper::getCentralFileId)
            .toList();

    fileStateIds.addAll(personRepository.findAllFileStateIdsByReferencePerson(centralFileIds));

    fileStateIds.addAll(facilityRepository.findAllFileStateIdsByReferenceFacility(centralFileIds));
    return fileStateIds;
  }

  public List<Person> getLinkedPersons(GetGdprProcedureResponse procedure) {
    if (!procedure.centralFileIds().isEmpty()) {
      return personRepository.findAllByExternalIdInAndReferencePersonIsNullOrderById(
          procedure.centralFileIds());
    }
    return List.of();
  }

  public List<Facility> getLinkedFacilities(GetGdprProcedureResponse procedure) {
    if (!procedure.centralFileIds().isEmpty()) {
      return facilityRepository.findAllByExternalIdInAndReferenceFacilityIsNullOrderById(
          procedure.centralFileIds());
    }
    return List.of();
  }

  public ResponseEntity<Resource> generateResponseWithRightToObjectLetter(GdprProcedure procedure) {
    if (procedure.getType() != GdprProcedureType.RIGHT_TO_OBJECT) {
      throw new BadRequestException(
          "Cannot create report document for procedure of type " + procedure.getType());
    }

    byte[] pdf = rightToObjectLetterGenerator.generatePdf(procedure);

    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename("Widerspruch-%s.pdf".formatted(procedure.getExternalId()))
                .build()
                .toString())
        .contentType(MediaType.APPLICATION_PDF)
        .body(new ByteArrayResource(pdf));
  }

  public GetGdprProcedureFileStateIdsResponse getFileStateResponseByExternalIds(
      GdprProcedure gdprProcedure) {
    List<UUID> refExternalIds =
        gdprProcedure.getCentralFileIdsWrappers().stream()
            .map(CentralFileIdWrapper::getCentralFileId)
            .toList();
    List<UUID> personFileStateIds =
        personRepository.findAllFileStateIdsByReferencePerson(refExternalIds);

    List<UUID> facilityFileStateIds =
        facilityRepository.findAllFileStateIdsByReferenceFacility(refExternalIds);

    return new GetGdprProcedureFileStateIdsResponse(personFileStateIds, facilityFileStateIds);
  }
}

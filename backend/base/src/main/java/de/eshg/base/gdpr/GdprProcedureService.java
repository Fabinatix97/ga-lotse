/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.gdpr.persistence.CentralFileIdWrapper;
import de.eshg.base.gdpr.persistence.DownloadPackage;
import de.eshg.base.gdpr.persistence.GdprDownload;
import de.eshg.base.gdpr.persistence.GdprFacility;
import de.eshg.base.gdpr.persistence.GdprProcedure;
import de.eshg.base.gdpr.persistence.GdprProcedureStatus;
import de.eshg.base.gdpr.persistence.GdprProcedureType;
import de.eshg.base.gdpr.persistence.GdprProcedure_;
import de.eshg.base.gdpr.persistence.repository.GdprProcedureRepository;
import de.eshg.base.keycloak.CitizenKeycloakClient;
import de.eshg.base.util.PaginationUtil;
import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.domain.model.serialization.SerializationService;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.validation.ValidationUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class GdprProcedureService {

  private static final String AUDITLOG_CATEGORY = "DSGVO";

  private static final Logger log = LoggerFactory.getLogger(GdprProcedureService.class);
  private final GdprProcedureRepository repository;
  private final PersonRepository personRepository;
  private final FacilityRepository facilityRepository;
  private final GdprDownloadRepository downloadRepository;
  private final SerializationService serializationService;
  private final AuditLogger auditLogger;
  private final Clock clock;
  private final EntityManager entityManager;
  private final CitizenKeycloakClient citizenKeycloakClient;
  private final Validator validator;

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
      GdprDownloadRepository downloadRepository,
      SerializationService serializationService,
      AuditLogger auditLogger,
      Clock clock,
      EntityManager entityManager,
      CitizenKeycloakClient citizenKeycloakClient,
      Validator validator) {
    this.repository = procedureRepository;
    this.personRepository = personRepository;
    this.facilityRepository = facilityRepository;
    this.downloadRepository = downloadRepository;
    this.serializationService = serializationService;
    this.auditLogger = auditLogger;
    this.clock = clock;
    this.entityManager = entityManager;
    this.citizenKeycloakClient = citizenKeycloakClient;
    this.validator = validator;
  }

  public GdprProcedure add(GdprProcedure procedure) {
    procedure.setStatus(GdprProcedureStatus.DRAFT);
    GdprProcedure saved = repository.save(procedure);
    writeAuditLog("DSGVO Vorgang anlegen", mapAuditLog(saved));
    return saved;
  }

  public Optional<GdprProcedure> findByExternalId(UUID id) {
    return repository.findByExternalId(id);
  }

  public Page<GdprProcedure> findAll(
      GdprProcedureType gdprProcedureType, PaginationUtil.PageSpec pageSpec) {
    Specification<GdprProcedure> specification = Specification.allOf(hasType(gdprProcedureType));

    return repository.findAll(
        specification,
        PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize(), Sort.by(pageSpec.order())));
  }

  public GdprProcedure addCentralFileIdsToGdprProcedure(
      List<CentralFileIdWrapper> centralFileIds, UUID gdprProcedureId, long version) {
    GdprProcedure procedure = getGdprProcedureForUpdate(gdprProcedureId);
    ValidationUtil.validateVersion(version, procedure);

    throwIfCentralFileIdAlreadyExists(centralFileIds, procedure);

    entityManager.lock(procedure, LockModeType.PESSIMISTIC_FORCE_INCREMENT);
    procedure.addCentralFileIds(centralFileIds);

    writeAuditLog("StammdatenIDs hinzufügen", mapAuditLog(procedure));
    return procedure;
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

  public GdprFacility getCitizenSelfUserIdentificationData() {
    UserRepresentation representation = citizenKeycloakClient.getSelfUser().toRepresentation();
    Map<String, List<String>> userAttributes = representation.getAttributes();

    FacilityIdentificationDataForValidation dataDto =
        MukAttributesMapper.mapFromKeycloak(userAttributes);
    validateIdentificationData(dataDto);

    return MukAttributesMapper.mapToDm(dataDto);
  }

  private void validateIdentificationData(FacilityIdentificationDataForValidation dataDto) {
    Set<ConstraintViolation<FacilityIdentificationDataForValidation>> violations =
        validator.validate(dataDto);

    if (!violations.isEmpty()) {
      throw new ConstraintViolationException("MUK attributes constraints violated", violations);
    }
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

    return serializationService.toNestedZip("Sachstand-", fileStates);
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
}

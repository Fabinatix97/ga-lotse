/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.progressentry;

import static de.eshg.lib.procedure.MapperHelper.mapAndSet;
import static de.eshg.lib.procedure.file.MultipartFileParser.validateAndParseFile;

import de.eshg.file.common.PdfAConformanceValidator;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.foureyes.domain.repository.GenericApprovalRequestRepository;
import de.eshg.lib.procedure.audit.AuditService;
import de.eshg.lib.procedure.cemetery.CemeteryService;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.KeyDocumentAware;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequest;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequestNotification;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryType;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.repository.ManualProgressEntryRepository;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.domain.repository.ProgressEntryRepository;
import de.eshg.lib.procedure.file.MultipartFileParser;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.mapping.ProgressEntryMapper;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.lib.procedure.model.GetManualProgressEntryHistoryResponse;
import de.eshg.lib.procedure.model.ManualProgressEntryHistoryDto;
import de.eshg.lib.procedure.model.ManualProgressEntryTypeDto;
import de.eshg.lib.procedure.model.PatchManualProgressEntryRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import org.apache.commons.lang3.exception.UncheckedException;
import org.openapitools.jackson.nullable.JsonNullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProgressEntryService<P extends Procedure<P, ?, ?, ?>> {

  private static final Logger log = LoggerFactory.getLogger(ProgressEntryService.class);

  private final ProcedureRepository<P> procedureRepository;
  private final ProgressEntryRepository progressEntryRepository;
  private final ManualProgressEntryRepository manualProgressEntryRepository;
  private final GenericApprovalRequestRepository approvalRequestRepository;
  private final CemeteryService cemeteryService;
  private final AuditService auditService;
  private final UserHelper userHelper;
  private final ProgressEntryProperties progressEntryProperties;
  private final AuditLogger auditLogger;

  public ProgressEntryService(
      ProcedureRepository<P> procedureRepository,
      ProgressEntryRepository progressEntryRepository,
      ManualProgressEntryRepository manualProgressEntryRepository,
      GenericApprovalRequestRepository approvalRequestRepository,
      CemeteryService cemeteryService,
      AuditService auditService,
      UserHelper userHelper,
      ProgressEntryProperties progressEntryProperties,
      AuditLogger auditLogger) {

    this.procedureRepository = procedureRepository;
    this.progressEntryRepository = progressEntryRepository;
    this.manualProgressEntryRepository = manualProgressEntryRepository;
    this.approvalRequestRepository = approvalRequestRepository;
    this.cemeteryService = cemeteryService;
    this.auditService = auditService;
    this.userHelper = userHelper;
    this.progressEntryProperties = progressEntryProperties;
    this.auditLogger = auditLogger;
  }

  public P getProcedureOrThrow(UUID procedureId) {
    return procedureRepository
        .findByExternalId(procedureId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  @Transactional(propagation = Propagation.MANDATORY)
  public SystemProgressEntry addSystemProgressEntry(
      P procedure, SystemProgressEntry systemProgressEntry) {
    return addSystemProgressEntry(procedure, systemProgressEntry, (File) null);
  }

  @Transactional(propagation = Propagation.MANDATORY)
  public SystemProgressEntry addSystemProgressEntry(
      P procedure, SystemProgressEntry systemProgressEntry, MultipartFile file) throws IOException {
    return addSystemProgressEntry(
        procedure,
        systemProgressEntry,
        validateAndParseFile(file, progressEntryProperties.getMaxImageSideLength()));
  }

  @Transactional(propagation = Propagation.MANDATORY)
  public SystemProgressEntry addSystemProgressEntry(
      P procedure, SystemProgressEntry systemProgressEntry, File file) {
    validateProcedureIsOpen(procedure, IllegalArgumentException::new);
    if (file != null) {
      validateFile(file);
    } else {
      validateKeyDocumentTypesAreUnset(systemProgressEntry);
    }

    procedure.addProgressEntry(systemProgressEntry);

    if (file != null) {
      systemProgressEntry.setKeyDocumentVersion(
          getKeyDocumentVersion(procedure, systemProgressEntry));
      systemProgressEntry.setFile(file);

      auditLogFileAdd(procedure.getExternalId(), systemProgressEntry);
    }

    return systemProgressEntry;
  }

  public ManualProgressEntry addManualProgressEntry(
      UUID procedureId,
      ManualProgressEntry manualProgressEntry,
      MultipartFile file,
      FileMetaDataDto fileMetaData)
      throws IOException {
    P resolvedProcedure = getOpenProcedureOrThrow(procedureId);
    if (file != null) {
      validateFileIsNotAlreadyUploadedForProcedure(file, resolvedProcedure, manualProgressEntry);
    }
    manualProgressEntry.setProcedureId(resolvedProcedure.getId());
    resolvedProcedure.addProgressEntry(manualProgressEntry);

    if (Optional.ofNullable(file).isPresent()) {
      ProcedureFileType fileType = MultipartFileParser.parseProcedureFileType(file);

      MultipartFileParser.validateProgressEntryTypeSupportsFileType(manualProgressEntry, fileType);
      validateKeyDocumentsUniformFileTypes(manualProgressEntry, fileType);

      File parsedFile = validateAndParseFile(file, progressEntryProperties.getMaxImageSideLength());
      Optional.ofNullable(fileMetaData)
          .map(FileMetaDataDto::getDescription)
          .ifPresent(parsedFile.getMetaData()::setDescription);
      parsedFile.updateDeletable(true);
      manualProgressEntry.setFile(parsedFile);

      Integer keyDocumentVersion = getKeyDocumentVersion(resolvedProcedure, manualProgressEntry);
      manualProgressEntry.setKeyDocumentVersion(keyDocumentVersion);
    } else if (Optional.ofNullable(manualProgressEntry.getKeyDocumentType()).isPresent()) {
      throw new BadRequestException("KeyDocumentType must only be set when a file is uploaded");
    }

    manualProgressEntryRepository.flush();
    auditLogFileUpload(procedureId, manualProgressEntry);

    return manualProgressEntry;
  }

  private void validateFileIsNotAlreadyUploadedForProcedure(
      MultipartFile uploadFile, P resolvedProcedure, ManualProgressEntry manualProgressEntry)
      throws IOException {
    for (ProgressEntry progressEntry : resolvedProcedure.getProgressEntries()) {
      if (progressEntry instanceof ManualProgressEntry procedureManualProgressEntry
          && Objects.equals(
              procedureManualProgressEntry.getKeyDocumentType(),
              manualProgressEntry.getKeyDocumentType())
          && progressEntry.getFile() != null) {
        File file = progressEntry.getFile();
        if (!file.isDeleted()
            && file.getFileName().equals(uploadFile.getOriginalFilename())
            && Arrays.equals(
                hashFileContent(file.getFileContent().getContent()),
                hashFileContent(uploadFile.getBytes()))) {
          throw new BadRequestException(ErrorCode.ALREADY_EXISTS, "File already exists");
        }
      }
    }
  }

  private byte[] hashFileContent(byte[] fileContent) {
    try {
      return MessageDigest.getInstance("SHA-256").digest(fileContent);
    } catch (NoSuchAlgorithmException e) {
      throw new UncheckedException(e);
    }
  }

  private void auditLogFileUpload(UUID procedureId, ProgressEntry progressEntry) {
    File uploadedFile = progressEntry.getFile();
    if (uploadedFile != null) {
      auditLogger.log(
          "Dokumentenmanagement",
          "Hochladen Datei",
          Map.of(
              "durch Benutzer",
              CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
              "ID Vorgang",
              procedureId.toString(),
              "ID Verlaufseintrag",
              progressEntry.getExternalId().toString(),
              "ID Datei",
              uploadedFile.getExternalId().toString(),
              "Dateityp",
              uploadedFile.getFileType().toString()));
    }
  }

  private void auditLogFileAdd(UUID procedureId, ProgressEntry progressEntry) {
    File uploadedFile = progressEntry.getFile();
    if (uploadedFile != null) {
      auditLogger.log(
          "Dokumentenmanagement",
          "Hinzufügen Datei",
          Map.of(
              "durch Benutzer",
              CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
              "ID Vorgang",
              procedureId.toString(),
              "ID Verlaufseintrag",
              progressEntry.getExternalId().toString(),
              "ID Datei",
              uploadedFile.getExternalId().toString(),
              "Dateityp",
              uploadedFile.getFileType().toString()));
    }
  }

  private Integer getKeyDocumentVersion(P resolvedProcedure, KeyDocumentAware keyDocumentAware) {
    String keyDocumentType = keyDocumentAware.getKeyDocumentType();

    if (keyDocumentType == null) {
      return null;
    }

    return progressEntryRepository.countByProcedureIdAndKeyDocumentType(
        resolvedProcedure.getId(), keyDocumentType);
  }

  public void removeProgressEntry(UUID procedureId, UUID progressEntryId) {
    P procedure = getProcedureOrThrow(procedureId);
    ManualProgressEntry progressEntry = getManualProgressEntryOrThrow(procedure, progressEntryId);
    removeProgressEntry(procedure, progressEntry);
  }

  public void removeProgressEntry(ManualProgressEntry progressEntry) {
    P procedure = getProcedureOrThrow(progressEntry);
    removeProgressEntry(procedure, progressEntry);
  }

  private void removeProgressEntry(P procedure, ManualProgressEntry progressEntry) {
    validateProcedureIsOpen(procedure, BadRequestException::new);
    validateProgressEntryNotLocked(progressEntry);
    auditLogProgressEntryDeletion(progressEntry.getExternalId());

    cemeteryService.writeToCemetery(progressEntry);

    progressEntryRepository.delete(progressEntry);
  }

  private void auditLogProgressEntryDeletion(UUID progressEntryId) {
    auditLogger.log(
        "Verlaufsdokumentation",
        "Löschung Verlaufseintrag",
        Map.of(
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "ID",
            progressEntryId.toString()));
  }

  public ManualProgressEntry patchProgressEntry(
      UUID procedureId,
      UUID progressEntryId,
      PatchManualProgressEntryRequest patchManualProgressEntryRequest) {
    P procedure = getOpenProcedureOrThrow(procedureId);
    ManualProgressEntry progressEntry = getManualProgressEntryOrThrow(procedure, progressEntryId);

    if (!CurrentUserHelper.getCurrentUserId().equals(progressEntry.getCreatedBy())) {
      throw new BadRequestException(
          ErrorCode.INSUFFICIENT_USER_RIGHTS, "Can only be edited by creator");
    }
    validateProgressEntryNotLocked(progressEntry);

    auditLogPatchProgressEntry(
        procedureId, progressEntryId, patchManualProgressEntryRequest, progressEntry);

    patchManualProgressEntryRequest
        .manualProgressEntryType()
        .ifPresent(
            mapAndSet(
                ProgressEntryMapper::toDomainType, progressEntry::setManualProgressEntryType));
    patchManualProgressEntryRequest.note().ifPresent(progressEntry::setNote);

    manualProgressEntryRepository.flush();

    return progressEntry;
  }

  private void auditLogPatchProgressEntry(
      UUID procedureId,
      UUID progressEntryId,
      PatchManualProgressEntryRequest patchManualProgressEntryRequest,
      ManualProgressEntry progressEntry) {
    Set<String> updatedFields = new LinkedHashSet<>();

    JsonNullable<ManualProgressEntryTypeDto> typeJsonNullable =
        patchManualProgressEntryRequest.manualProgressEntryType();
    if (typeJsonNullable.isPresent()) {
      ManualProgressEntryType requestedType =
          ProgressEntryMapper.toDomainType(typeJsonNullable.get());
      if (progressEntry.getManualProgressEntryType() != requestedType) {
        updatedFields.add("Typ des Verlaufseintrags");
      }
    }

    JsonNullable<String> noteJsonNullable = patchManualProgressEntryRequest.note();
    if (noteJsonNullable.isPresent()) {
      if (!Objects.equals(noteJsonNullable.get(), progressEntry.getNote())) {
        updatedFields.add("Bemerkung");
      }
    }

    auditLogger.log(
        "Dokumentenmanagement",
        "Änderung Verlaufseintrag",
        Map.of(
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "ID Vorgang",
            procedureId.toString(),
            "ID Verlaufseintrag",
            progressEntryId.toString(),
            "Typ Verlaufseintrag",
            progressEntry.getManualProgressEntryType().name(),
            "geänderte Felder",
            String.join(", ", updatedFields)));
  }

  public GetManualProgressEntryHistoryResponse getManualProgressEntryHistory(
      UUID procedureId, UUID progressEntryId) {
    ManualProgressEntry manualProgressEntry =
        getManualProgressEntryOrThrow(procedureId, progressEntryId);

    List<ManualProgressEntryHistoryDto> progressEntryHistory =
        auditService
            .getRevisionsOfEntity(ManualProgressEntry.class, manualProgressEntry.getId())
            .stream()
            .map(ProgressEntryMapper::toInterfaceType)
            .toList();

    return new GetManualProgressEntryHistoryResponse(progressEntryHistory);
  }

  public ManualProgressEntryDeletionApprovalRequest requestProgressEntryDeletion(
      UUID procedureId, UUID progressEntryId, String reason) {
    P procedure = getOpenProcedureOrThrow(procedureId);
    ManualProgressEntry manualProgressEntry =
        getManualProgressEntryOrThrow(procedure, progressEntryId);

    validateProgressEntryNotLocked(manualProgressEntry);

    manualProgressEntry.lock(true);

    ManualProgressEntryDeletionApprovalRequest manualProgressEntryDeletionApprovalRequest =
        new ManualProgressEntryDeletionApprovalRequest();
    manualProgressEntryDeletionApprovalRequest.updateEntity(manualProgressEntry);
    manualProgressEntryDeletionApprovalRequest.setReason(reason);

    createApprovalRequestNotifications()
        .forEach(manualProgressEntryDeletionApprovalRequest::addNotification);

    auditLogProgressEntryDeletionRequest(procedureId, progressEntryId);

    return approvalRequestRepository.save(manualProgressEntryDeletionApprovalRequest);
  }

  private void auditLogProgressEntryDeletionRequest(UUID procedureId, UUID progressEntryId) {
    auditLogger.log(
        "Freigabeprozess",
        "Löschanfrage",
        Map.of(
            "Angefragt durch Benutzer",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "Objekttyp",
            "Verlaufseintrag",
            "ID Vorgang",
            procedureId.toString(),
            "ID Verlaufseintrag",
            progressEntryId.toString()));
  }

  private List<ManualProgressEntryDeletionApprovalRequestNotification>
      createApprovalRequestNotifications() {
    return userHelper.getUuidsOfModuleLeaders().stream()
        .map(this::createApprovalRequestNotification)
        .toList();
  }

  private ManualProgressEntryDeletionApprovalRequestNotification createApprovalRequestNotification(
      UUID user) {
    log.debug("Creating approval request notification for user {}", user);
    ManualProgressEntryDeletionApprovalRequestNotification notification =
        new ManualProgressEntryDeletionApprovalRequestNotification();
    notification.setRecipientUserId(user);
    return notification;
  }

  private ManualProgressEntry getManualProgressEntryOrThrow(
      UUID procedureId, UUID progressEntryId) {
    P procedure = getProcedureOrThrow(procedureId);
    return getManualProgressEntryOrThrow(procedure, progressEntryId);
  }

  private ManualProgressEntry getManualProgressEntryOrThrow(P procedure, UUID progressEntryId) {
    ProgressEntry progressEntry = getProgressEntryOrThrow(procedure, progressEntryId);
    return getAndValidateIsManualProgressEntry(progressEntry);
  }

  private ManualProgressEntry getAndValidateIsManualProgressEntry(ProgressEntry progressEntry) {
    if (!(progressEntry instanceof ManualProgressEntry manualProgressEntry)) {
      throw new BadRequestException("ProgressEntry must be a ManualProgressEntry");
    }
    return manualProgressEntry;
  }

  public ProgressEntry getProgressEntryOrThrow(UUID procedureId, UUID progressEntryId) {
    P procedure = getProcedureOrThrow(procedureId);
    return getProgressEntryOrThrow(procedure, progressEntryId);
  }

  private ProgressEntry getProgressEntryOrThrow(P procedure, UUID progressEntryId) {
    return progressEntryRepository
        .findByProcedureIdAndExternalId(procedure.getId(), progressEntryId)
        .orElseThrow(() -> new NotFoundException("ProgressEntry does not exist for Procedure"));
  }

  private void validateFile(File file) {
    if (file instanceof Pdf) {
      PdfAConformanceValidator.validate(
          file.getFileContent().getContent(), IllegalArgumentException::new);
    }
  }

  private void validateProgressEntryNotLocked(ManualProgressEntry progressEntry) {
    if (progressEntry.isLocked()) {
      throw new BadRequestException("Progress Entry is locked");
    }
  }

  private void validateProcedureIsOpen(
      P procedure, Function<String, RuntimeException> exceptionConstructor) {
    if (!procedure.getProcedureStatus().isOpen()) {
      throw exceptionConstructor.apply(
          "Procedure " + procedure.getExternalId() + " is already closed.");
    }
  }

  private void validateKeyDocumentsUniformFileTypes(
      ManualProgressEntry manualProgressEntry, ProcedureFileType fileType) {
    String keyDocumentType = manualProgressEntry.getKeyDocumentType();

    if (keyDocumentType == null) {
      return;
    }

    if (manualProgressEntryRepository.existsByProcedureIdAndKeyDocumentTypeAndFileFileTypeNot(
        manualProgressEntry.getProcedureId(), keyDocumentType, fileType)) {
      throw new BadRequestException(
          "Key document type `%s` does not support file type `%s`."
              .formatted(keyDocumentType, fileType));
    }
  }

  private void validateKeyDocumentTypesAreUnset(SystemProgressEntry systemProgressEntry) {
    Assert.isNull(
        systemProgressEntry.getKeyDocumentType(),
        "Key document type can only be set when file is present");

    Assert.isNull(
        systemProgressEntry.getKeyDocumentVersion(),
        "Key document version can only be set when file is present");
  }

  private P getOpenProcedureOrThrow(UUID procedureId) {
    P procedure = getProcedureOrThrow(procedureId);
    validateProcedureIsOpen(procedure, BadRequestException::new);
    return procedure;
  }

  private P getProcedureOrThrow(ManualProgressEntry progressEntry) {
    return procedureRepository
        .findById(progressEntry.getProcedureId())
        .orElseThrow(
            () -> new IllegalStateException("Procedure for progress entry does not exist"));
  }
}

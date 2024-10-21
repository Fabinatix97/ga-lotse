/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.foureyes.domain.repository.GenericApprovalRequestRepository;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileAware;
import de.eshg.lib.procedure.domain.model.FileContent;
import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequest;
import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequestNotification;
import de.eshg.lib.procedure.domain.model.Image;
import de.eshg.lib.procedure.domain.model.ImageMetaData;
import de.eshg.lib.procedure.domain.model.Mail;
import de.eshg.lib.procedure.domain.model.MailMetaData;
import de.eshg.lib.procedure.domain.model.MetaData;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.repository.FileRepository;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class FileStorageService {

  private final FileRepository fileRepository;
  private final FileAwareResolver fileAwareResolver;
  private final ProcedureRepository<?> procedureRepository;
  private final GenericApprovalRequestRepository approvalRequestRepository;
  private final UserHelper userHelper;
  private final AuditLogger auditLogger;

  public FileStorageService(
      FileRepository fileRepository,
      FileAwareResolver fileAwareResolver,
      ProcedureRepository<?> procedureRepository,
      GenericApprovalRequestRepository approvalRequestRepository,
      UserHelper userHelper,
      AuditLogger auditLogger) {
    this.fileRepository = fileRepository;
    this.fileAwareResolver = fileAwareResolver;
    this.procedureRepository = procedureRepository;
    this.approvalRequestRepository = approvalRequestRepository;
    this.userHelper = userHelper;
    this.auditLogger = auditLogger;
  }

  public void persistFile(File file, FileAware fileAware) {
    FileAware resolvedFileAware = fileAwareResolver.resolve(fileAware);
    resolvedFileAware.setFile(file);
  }

  public void persistFileAndUpdateProgressEntry(
      Mail mail, String subject, String messageText, FileAware fileAware) {
    FileAware resolvedFileAware = fileAwareResolver.resolve(fileAware);
    resolvedFileAware.setFile(mail);
    resolvedFileAware.setSubject(subject);
    resolvedFileAware.setMessageText(messageText);
  }

  File updateFileMetaData(UUID fileId, MetaData metaData) {
    File file = findFileForModificationOrThrow(fileId);
    validateNotAttachedToClosedProcedure(file);

    switch (file) {
      case Image image -> updateMetaData(image, metaData);
      case Pdf pdf -> updateMetaData(pdf, metaData);
      case Mail mail -> updateMetaData(mail, metaData);
      default ->
          throw new BadRequestException(
              "Unsupported file subclass: %s".formatted(file.getClass().getSimpleName()));
    }

    fileRepository.flush();

    return file;
  }

  private void updateMetaData(Image image, MetaData metaData) {
    if (metaData instanceof ImageMetaData imageMetaData) {
      ImageMetaData persistedMetaData = image.getMetaData();
      persistedMetaData.setCreatedDate(imageMetaData.getCreatedDate());
      persistedMetaData.setDescription(imageMetaData.getDescription());
      auditLogImageMetaDataModification(image, imageMetaData);
    } else {
      throw createBadMetaDataFormatException();
    }
  }

  private void auditLogImageMetaDataModification(Image image, ImageMetaData updatedMetaData) {
    Set<String> updatedFields = new LinkedHashSet<>();
    ImageMetaData currentMetaData = image.getMetaData();

    if (!Objects.equals(updatedMetaData.getDescription(), currentMetaData.getDescription())) {
      updatedFields.add("Beschreibung");
    }

    if (!Objects.equals(updatedMetaData.getCreatedDate(), currentMetaData.getCreatedDate())) {
      updatedFields.add("Erstellungsdatum");
    }

    auditLogMetaDataModification(updatedFields, image.getFileType(), image.getExternalId());
  }

  private void auditLogMetaDataModification(
      Set<String> updatedFields, ProcedureFileType fileType, UUID externalId) {
    auditLogger.log(
        "Dokumentenmanagement",
        "Änderungen Metadaten",
        Map.of(
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "Typ der Datei",
            fileType.name(),
            "ID",
            externalId.toString(),
            "geänderte Felder",
            String.join(", ", updatedFields)));
  }

  private void updateMetaData(Pdf pdf, MetaData metaData) {
    if (metaData instanceof PdfMetaData pdfMetaData) {
      PdfMetaData persistedMetaData = pdf.getMetaData();
      persistedMetaData.setCreatedDate(pdfMetaData.getCreatedDate());
      persistedMetaData.setDescription(pdfMetaData.getDescription());
      auditLogPdfMetaDataModification(pdf, pdfMetaData);
    } else {
      throw createBadMetaDataFormatException();
    }
  }

  private void auditLogPdfMetaDataModification(Pdf pdf, PdfMetaData updatedMetaData) {
    Set<String> updatedFields = new LinkedHashSet<>();
    PdfMetaData currentMetaData = pdf.getMetaData();

    if (!Objects.equals(updatedMetaData.getDescription(), currentMetaData.getDescription())) {
      updatedFields.add("Beschreibung");
    }

    if (!Objects.equals(updatedMetaData.getCreatedDate(), currentMetaData.getCreatedDate())) {
      updatedFields.add("Erstellungsdatum");
    }

    auditLogMetaDataModification(updatedFields, pdf.getFileType(), pdf.getExternalId());
  }

  private void updateMetaData(Mail mail, MetaData metaData) {
    if (metaData instanceof MailMetaData mailMetaData) {
      MailMetaData persistedMetaData = mail.getMetaData();
      persistedMetaData.setMailFrom(mailMetaData.getMailFrom());
      persistedMetaData.setMailTo(mailMetaData.getMailTo());
      persistedMetaData.setSentDate(mailMetaData.getSentDate());
      persistedMetaData.setDescription(mailMetaData.getDescription());
      auditLogMailMetaDataModification(mail, mailMetaData);
    } else {
      throw createBadMetaDataFormatException();
    }
  }

  private void auditLogMailMetaDataModification(Mail mail, MailMetaData updatedMetaData) {
    Set<String> updatedFields = new LinkedHashSet<>();
    MailMetaData currentMetaData = mail.getMetaData();

    if (!Objects.equals(updatedMetaData.getDescription(), currentMetaData.getDescription())) {
      updatedFields.add("Beschreibung");
    }

    if (!Objects.equals(updatedMetaData.getMailFrom(), currentMetaData.getMailFrom())) {
      updatedFields.add("Absender");
    }

    if (!Objects.equals(updatedMetaData.getMailTo(), currentMetaData.getMailTo())) {
      updatedFields.add("Empfänger");
    }

    if (!Objects.equals(updatedMetaData.getSentDate(), currentMetaData.getSentDate())) {
      updatedFields.add("Versanddatum");
    }

    auditLogMetaDataModification(updatedFields, mail.getFileType(), mail.getExternalId());
  }

  private BadRequestException createBadMetaDataFormatException() {
    return new BadRequestException("Bad meta data format");
  }

  public void deleteFile(UUID fileId) {
    File file = findFileOrThrow(fileId);
    deleteFile(file);
  }

  public void deleteFile(File file) {
    validateNotLocked(file);
    if (!file.isDeletable()) {
      throw new BadRequestException("File is not deletable");
    }

    validateNotAttachedToClosedProcedure(file);
    auditLogSoftFileDeletion(file.getExternalId());
    file.setDeleted(true);

    if (file instanceof Mail mail) {
      for (File attachment : mail.getAttachments()) {
        deleteFile(attachment);
      }
    }
  }

  private void auditLogSoftFileDeletion(UUID fileId) {
    auditLogger.log(
        "Dokumentenmanagement",
        "Löschen Datei (soft delete)",
        Map.of(
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "ID",
            fileId.toString()));
  }

  private File findFileForModificationOrThrow(UUID fileId) {
    File file = findFileOrThrow(fileId);
    validateNotLocked(file);
    return file;
  }

  File findFileOrThrow(UUID fileId) {
    return fileRepository
        .findByExternalIdAndDeletedFalse(fileId)
        .orElseThrow(() -> new NotFoundException("File not found"));
  }

  FileContent getFileContent(UUID fileId) {
    return fileRepository
        .findFileContentByExternalIdAndDeletedFalse(fileId)
        .orElseThrow(() -> new NotFoundException("File not found"));
  }

  public FileDeletionApprovalRequest requestFileDeletion(UUID fileId, String reason) {
    File file = findFileForModificationOrThrow(fileId);
    Procedure<?, ?, ?, ?> procedure = getAttachedProcedureOrThrow(file);
    validateProcedureNotClosed(procedure);

    file.lock(true);

    FileDeletionApprovalRequest fileDeletionApprovalRequest = new FileDeletionApprovalRequest();
    fileDeletionApprovalRequest.setFile(file);
    fileDeletionApprovalRequest.setReason(reason);

    userHelper.getUuidsOfModuleLeaders().stream()
        .map(this::createApprovalRequestNotification)
        .forEach(fileDeletionApprovalRequest::addNotification);

    auditLogFileDeletionRequest(fileId);

    return approvalRequestRepository.save(fileDeletionApprovalRequest);
  }

  private void auditLogFileDeletionRequest(UUID fileId) {
    auditLogger.log(
        "Freigabeprozess",
        "Löschanfrage",
        Map.of(
            "Angefragt durch Benutzer",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "Objekttyp",
            "Datei",
            "ID",
            fileId.toString()));
  }

  private FileDeletionApprovalRequestNotification createApprovalRequestNotification(UUID userId) {
    FileDeletionApprovalRequestNotification notification =
        new FileDeletionApprovalRequestNotification();
    notification.setRecipientUserId(userId);
    return notification;
  }

  private Procedure<?, ?, ?, ?> getAttachedProcedureOrThrow(File file) {
    return procedureRepository
        .findByFile(file)
        .orElseThrow(
            () ->
                new BadRequestException(
                    "Only files associated with a procedure can be requested to be deleted."));
  }

  private void validateProcedureNotClosed(Procedure<?, ?, ?, ?> procedure) {
    if (ProcedureStatus.isClosed(procedure.getProcedureStatus())) {
      throw new BadRequestException("Files attached to closed procedures can not be modified.");
    }
  }

  private void validateNotAttachedToClosedProcedure(File file) {
    boolean isAttachedToClosedProcedure =
        procedureRepository.findStatusByFile(file).filter(ProcedureStatus::isClosed).isPresent();
    if (isAttachedToClosedProcedure) {
      throw new BadRequestException("Files attached to closed procedures can not be modified.");
    }
  }

  private void validateNotLocked(File file) {
    if (file.isLocked()) {
      throw new BadRequestException("File is locked");
    }
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.document;

import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.springframework.http.MediaType.APPLICATION_PDF_VALUE;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

import de.eshg.lib.procedure.model.FileTypeDto;
import de.eshg.officialmedicalservice.document.api.PatchDocumentInformationRequest;
import de.eshg.officialmedicalservice.document.api.PatchDocumentNoteRequest;
import de.eshg.officialmedicalservice.document.api.PatchDocumentReviewRequest;
import de.eshg.officialmedicalservice.document.api.PostDocumentRequest;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentRepository;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentStatus;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFile;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFileRepository;
import de.eshg.officialmedicalservice.procedure.OmsProgressEntryType;
import de.eshg.officialmedicalservice.procedure.ProgressEntryService;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OmsDocumentService {
  private final OmsProcedureRepository omsProcedureRepository;
  private final OmsDocumentRepository omsDocumentRepository;
  private final OmsFileRepository omsFileRepository;
  private final ProgressEntryService progressEntryService;
  private final Clock clock;

  private static final Logger logger = LoggerFactory.getLogger(OmsDocumentService.class);

  public OmsDocumentService(
      OmsProcedureRepository omsProcedureRepository,
      OmsDocumentRepository omsDocumentRepository,
      OmsFileRepository omsFileRepository,
      ProgressEntryService progressEntryService,
      Clock clock) {
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsDocumentRepository = omsDocumentRepository;
    this.omsFileRepository = omsFileRepository;
    this.progressEntryService = progressEntryService;
    this.clock = clock;
  }

  @Transactional
  public UUID addDocumentEmployee(
      UUID externalId, PostDocumentRequest request, List<MultipartFile> files, String note) {
    OmsProcedure omsProcedure = loadOmsProcedure(externalId);

    if (omsProcedure.isFinalized()) {
      throw new BadRequestException("Document cannot be added when the procedure is finalized.");
    }
    validateFileTypes(files);

    OmsDocument document = new OmsDocument();
    document.setDocumentTypeDe(request.documentTypeDe());
    document.setDocumentTypeEn(request.documentTypeEn());
    document.setHelpTextDe(request.helpTextDe());
    document.setHelpTextEn(request.helpTextEn());

    if (!files.isEmpty()) {
      document.setReasonForRejection(null);
      document.setDocumentStatus(OmsDocumentStatus.ACCEPTED);
      document.setLastDocumentUpload(Instant.now(clock));
      document.setNote(note);
    } else {
      document.setDocumentStatus(OmsDocumentStatus.MISSING);
    }

    document.setMandatoryDocument(request.mandatoryDocument());
    document.setUploadInCitizenPortal(request.uploadInCitizenPortal());

    document.setOmsProcedure(omsProcedure);
    omsDocumentRepository.save(document);

    saveFiles(document, files);

    if (document.isUploadInCitizenPortal() && document.getFiles().isEmpty()) {
      progressEntryService.createProgressEntryAddDocumentEmployee(
          omsProcedure, OmsProgressEntryType.DOCUMENT_MISSING_BY_CITIZEN, document);
    } else if (!document.isUploadInCitizenPortal() && document.getFiles().isEmpty()) {
      progressEntryService.createProgressEntryAddDocumentEmployee(
          omsProcedure, OmsProgressEntryType.DOCUMENT_MISSING_BY_EMPLOYEE, document);
    } else if (!document.isUploadInCitizenPortal() && !document.getFiles().isEmpty()) {
      progressEntryService.createProgressEntryAddDocumentEmployee(
          omsProcedure, OmsProgressEntryType.DOCUMENT_ACCEPTED, document);
    }

    return document.getExternalId();
  }

  @Transactional
  public void updateDocumentInformationEmployee(
      UUID documentId, PatchDocumentInformationRequest request) {
    OmsDocument omsDocument = loadOmsDocument(documentId);

    if (omsDocument.getOmsProcedure().isFinalized()) {
      throw new BadRequestException(
          "Document information cannot be updated when the procedure is finalized.");
    }
    if (omsDocument.getDocumentStatus() != OmsDocumentStatus.MISSING) {
      throw new BadRequestException("Document information can only be updated in MISSING status");
    }

    String oldDocumentTypeDe = omsDocument.getDocumentTypeDe();
    String oldHelpTextDe = omsDocument.getHelpTextDe();
    omsDocument.setDocumentTypeDe(request.documentTypeDe());
    omsDocument.setDocumentTypeEn(request.documentTypeEn());
    omsDocument.setHelpTextDe(request.helpTextDe());
    omsDocument.setHelpTextEn(request.helpTextEn());
    omsDocument.setMandatoryDocument(request.mandatoryDocument());
    omsDocument.setUploadInCitizenPortal(request.uploadInCitizenPortal());

    if (!Objects.equals(oldDocumentTypeDe, request.documentTypeDe())
        || !Objects.equals(oldHelpTextDe, request.helpTextDe())) {
      OmsProcedure omsProcedure = omsDocument.getOmsProcedure();
      progressEntryService.createProgressEntryUpdateDocumentInformation(
          omsProcedure, omsDocument, oldDocumentTypeDe, oldHelpTextDe);
    }
  }

  @Transactional
  public void completeDocumentFileUploadEmployee(UUID documentId, List<MultipartFile> files) {
    OmsDocument omsDocument = loadOmsDocument(documentId);

    if (omsDocument.getOmsProcedure().isFinalized()) {
      throw new BadRequestException(
          "File upload cannot be completed when the procedure is finalized.");
    }
    if (omsDocument.getDocumentStatus() == OmsDocumentStatus.ACCEPTED) {
      throw new BadRequestException("Files can not be uploaded twice");
    }
    validateFileTypes(files);

    saveFiles(omsDocument, files);
    omsDocument.setReasonForRejection(null);
    omsDocument.setDocumentStatus(OmsDocumentStatus.ACCEPTED);
    omsDocument.setLastDocumentUpload(Instant.now(clock));

    OmsProcedure omsProcedure = omsDocument.getOmsProcedure();
    progressEntryService.createProgressEntryCompleteDocumentFileUploadEmployee(
        omsProcedure, omsDocument);
  }

  @Transactional
  public void deleteDocumentEmployee(UUID documentId) {
    OmsDocument omsDocument = loadOmsDocument(documentId);

    OmsProcedure omsProcedure = omsDocument.getOmsProcedure();
    if (omsProcedure.isFinalized()) {
      throw new BadRequestException("Documents cannot be deleted when the procedure is finalized.");
    }

    deleteDocument(omsDocument);
    progressEntryService.createProgressEntryForDocumentDeletion(omsProcedure, omsDocument);
  }

  @Transactional
  public void updateDocumentNoteEmployee(UUID documentId, PatchDocumentNoteRequest request) {
    OmsDocument omsDocument = loadOmsDocument(documentId);

    if (omsDocument.getOmsProcedure().isFinalized()) {
      throw new BadRequestException(
          "Document note can not be updated when the procedure is finalized.");
    }
    if (omsDocument.getFiles().isEmpty()) {
      throw new BadRequestException("Document note can not be updated when no files are uploaded");
    }

    omsDocument.setNote(request.note());
  }

  @Transactional
  public void reviewDocumentEmployee(UUID documentId, PatchDocumentReviewRequest request) {
    OmsDocument document = loadOmsDocument(documentId);

    if (document.getOmsProcedure().isFinalized()) {
      throw new BadRequestException("Document cannot be reviewed when the procedure is finalized.");
    }
    if (document.getDocumentStatus() != OmsDocumentStatus.SUBMITTED) {
      throw new BadRequestException("Only submitted documents can be reviewed");
    }

    switch (request.result()) {
      case ACCEPTED:
        if (!isBlank(request.reasonForRejection())) {
          logger.warn(
              "Ignoring reasonForRejection for accepted document: {}",
              request.reasonForRejection());
        }
        document.setReasonForRejection(null);
        document.setDocumentStatus(OmsDocumentStatus.ACCEPTED);
        break;
      case REJECTED:
        if (isBlank(request.reasonForRejection())) {
          throw new BadRequestException("reasonForRejection must not be blank");
        }
        deleteAllFiles(document);
        document.setReasonForRejection(request.reasonForRejection());
        document.setDocumentStatus(OmsDocumentStatus.REJECTED);
    }
  }

  private void deleteAllFiles(OmsDocument document) {
    omsFileRepository.deleteAll(document.getFiles());
    document.getFiles().clear();
  }

  private OmsProcedure loadOmsProcedure(UUID externalId) {
    return omsProcedureRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  private OmsDocument loadOmsDocument(UUID externalId) {
    return omsDocumentRepository
        .findById(externalId)
        .orElseThrow(() -> new NotFoundException("Document not found"));
  }

  private void validateFileTypes(List<MultipartFile> files) {
    List<String> allowedFileTypes =
        List.of(APPLICATION_PDF_VALUE, IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE);

    for (MultipartFile file : files) {
      String contentType = file.getContentType();
      if (!allowedFileTypes.contains(contentType)) {
        throw new BadRequestException(
            "Invalid file type: " + contentType + ". Only PDF, JPG, and PNG are allowed.");
      }
    }
  }

  private byte[] getBytes(MultipartFile file) {
    try {
      return file.getBytes();
    } catch (IOException e) {
      throw new BadRequestException("Corrupt file content");
    }
  }

  private void saveFiles(OmsDocument omsDocument, List<MultipartFile> files) {
    for (MultipartFile file : files) {
      OmsFile omsFile = new OmsFile();
      omsFile.setFileName(file.getOriginalFilename());
      omsFile.setContent(getBytes(file));
      omsFile.setFileType(getFileType(file.getContentType()));
      omsFile.setCreatedDate(Instant.now(clock));
      omsFile.setDocument(omsDocument);

      omsFileRepository.save(omsFile);
      omsDocument.getFiles().add(omsFile);
    }
  }

  private FileTypeDto getFileType(String contentType) {
    if (contentType == null || contentType.isBlank()) {
      throw new BadRequestException("Content type is missing or empty.");
    }

    return switch (contentType) {
      case APPLICATION_PDF_VALUE -> FileTypeDto.PDF;
      case IMAGE_JPEG_VALUE -> FileTypeDto.JPEG;
      case IMAGE_PNG_VALUE -> FileTypeDto.PNG;
      default ->
          throw new BadRequestException(
              "Invalid file type: " + contentType + ". Only PDF, JPG, and PNG are allowed.");
    };
  }

  private void deleteDocument(OmsDocument omsDocument) {
    OmsProcedure omsProcedure = omsDocument.getOmsProcedure();
    omsDocument.setOmsProcedure(null);
    omsProcedure.getDocuments().remove(omsDocument);
  }
}

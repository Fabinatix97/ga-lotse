/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.document;

import static de.eshg.lib.procedure.file.MultipartFileParser.validateAndParseFile;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.springframework.http.MediaType.APPLICATION_PDF_VALUE;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.model.FileTypeDto;
import de.eshg.officialmedicalservice.citizenpublic.ValidateFilesResponse;
import de.eshg.officialmedicalservice.document.api.PatchDocumentInformationRequest;
import de.eshg.officialmedicalservice.document.api.PatchDocumentNoteRequest;
import de.eshg.officialmedicalservice.document.api.PatchDocumentReviewRequest;
import de.eshg.officialmedicalservice.document.api.PostDocumentRequest;
import de.eshg.officialmedicalservice.document.persistence.entity.DocumentUploadedBy;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentRepository;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocumentStatus;
import de.eshg.officialmedicalservice.document.persistence.entity.ProcedureNotification;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFile;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFileRepository;
import de.eshg.officialmedicalservice.notification.NotificationService;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.OmsProgressEntryType;
import de.eshg.officialmedicalservice.procedure.ProgressEntryService;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.i18n.Language;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
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
  private final NotificationService notificationService;
  private final ProcedureNotificationService procedureNotificationService;
  private final PersonClient personClient;

  private static final Logger logger = LoggerFactory.getLogger(OmsDocumentService.class);

  public OmsDocumentService(
      OmsProcedureRepository omsProcedureRepository,
      OmsDocumentRepository omsDocumentRepository,
      OmsFileRepository omsFileRepository,
      ProgressEntryService progressEntryService,
      Clock clock,
      NotificationService notificationService,
      ProcedureNotificationService procedureNotificationService,
      PersonClient personClient) {
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsDocumentRepository = omsDocumentRepository;
    this.omsFileRepository = omsFileRepository;
    this.progressEntryService = progressEntryService;
    this.clock = clock;
    this.notificationService = notificationService;
    this.procedureNotificationService = procedureNotificationService;
    this.personClient = personClient;
  }

  @Transactional
  public UUID addDocumentEmployee(
      UUID externalId, PostDocumentRequest request, List<MultipartFile> files, String note) {
    OmsProcedure omsProcedure = loadOmsProcedure(externalId);

    if (omsProcedure.isFinalized()) {
      throw new BadRequestException("Document cannot be added when the procedure is finalized.");
    }
    List<File> parsedFiles = validateAndParseFiles(files);

    OmsDocument document = new OmsDocument();
    for (Language language : Language.values()) {
      document.setDocumentType(language, request.documentType().get(language));
      document.setHelpText(language, request.helpText().get(language));
    }
    document.setLabCode(request.labCode());

    if (!files.isEmpty()) {
      document.setReasonForRejection(null);
      document.setDocumentStatus(OmsDocumentStatus.ACCEPTED);
      document.setLastDocumentUpload(Instant.now(clock));
      document.setNote(note);
      document.setUploadedBy(DocumentUploadedBy.INTERN);
    } else {
      document.setDocumentStatus(OmsDocumentStatus.MISSING);
    }

    document.setMandatoryDocument(request.mandatoryDocument());
    document.setUploadInCitizenPortal(request.uploadInCitizenPortal());

    document.setOmsProcedure(omsProcedure);
    omsDocumentRepository.save(document);

    saveFiles(document, parsedFiles);

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

    if (omsProcedure.getProcedureStatus() == ProcedureStatus.OPEN
        && omsProcedure.isSendEmailNotifications()
        && document.isUploadInCitizenPortal()) {
      Person person = omsProcedure.findAffectedPerson();
      AffectedPersonDto affectedPersonDto =
          PersonMapper.mapToAffectedPersonDto(
              personClient.getPersonFileState(person.getCentralFileStateId()), person.getVersion());
      notificationService.notifyNewDocument(
          affectedPersonDto,
          document.getDocumentType(Language.GERMAN),
          document.getHelpText(Language.GERMAN));
    }

    return document.getExternalId();
  }

  @Transactional
  public void addLetterOfAssignmentCitizen(OmsProcedure procedure, List<MultipartFile> files) {
    List<File> parsedFiles = validateAndParseFiles(files);

    OmsDocument document = new OmsDocument();
    document.setDocumentType(Language.GERMAN, "Auftragsschreiben");
    document.setDocumentType(Language.ENGLISH, "Letter of assignment");
    document.setDocumentStatus(OmsDocumentStatus.SUBMITTED);
    document.setLastDocumentUpload(Instant.now(clock));
    document.setMandatoryDocument(true);
    document.setUploadInCitizenPortal(true);
    document.setUploadedBy(DocumentUploadedBy.EXTERN);

    document.setOmsProcedure(procedure);
    omsDocumentRepository.save(document);

    saveFiles(document, parsedFiles);
  }

  public ValidateFilesResponse validateFilesBeforeUpload(List<MultipartFile> files) {
    List<String> errorMessages = new ArrayList<>();
    for (MultipartFile file : files) {
      try {
        validateAndParseFiles(Collections.singletonList(file));
        errorMessages.add(null);
      } catch (BadRequestException e) {
        errorMessages.add(e.getMessage());
      }
    }
    return new ValidateFilesResponse(errorMessages);
  }

  @Transactional
  public void addInitialReleaseFromConfidentiality(OmsProcedure procedure) {
    OmsDocument document = new OmsDocument();
    document.setDocumentType(Language.GERMAN, "Schweigepflichtsentbindung");
    document.setDocumentType(Language.ENGLISH, "Release from confidentiality");
    document.setDocumentStatus(OmsDocumentStatus.MISSING);
    document.setUploadInCitizenPortal(false);
    document.setMandatoryDocument(true);
    document.setOmsProcedure(procedure);

    omsDocumentRepository.save(document);
  }

  @Transactional
  public void updateDocumentInformationEmployee(
      UUID documentId, PatchDocumentInformationRequest request) {
    OmsDocument omsDocument = loadOmsDocument(documentId);

    if (omsDocument.getOmsProcedure().isFinalized()) {
      throw new BadRequestException(
          "Document information cannot be updated when the procedure is " + "finalized.");
    }
    if (omsDocument.getDocumentStatus() != OmsDocumentStatus.MISSING) {
      throw new BadRequestException("Document information can only be updated in MISSING status");
    }

    String oldDocumentTypeDe = omsDocument.getDocumentType(Language.GERMAN);
    String oldHelpTextDe = omsDocument.getHelpText(Language.GERMAN);
    boolean oldIsUploadInCitizenPortal = omsDocument.isUploadInCitizenPortal();
    for (Language language : Language.values()) {
      omsDocument.setDocumentType(language, request.documentType().get(language));
      omsDocument.setHelpText(language, request.helpText().get(language));
    }
    omsDocument.setMandatoryDocument(request.mandatoryDocument());
    omsDocument.setUploadInCitizenPortal(request.uploadInCitizenPortal());
    omsDocument.setLabCode(request.labCode());

    if (!Objects.equals(oldDocumentTypeDe, request.documentType().get(Language.GERMAN))
        || !Objects.equals(oldHelpTextDe, request.helpText().get(Language.GERMAN))) {
      OmsProcedure omsProcedure = omsDocument.getOmsProcedure();
      progressEntryService.createProgressEntryUpdateDocumentInformation(
          omsProcedure, omsDocument, oldDocumentTypeDe, oldHelpTextDe);
    }

    OmsProcedure omsProcedure = omsDocument.getOmsProcedure();
    boolean newIsUploadInCitizenPortal = omsDocument.isUploadInCitizenPortal();
    Person person = omsProcedure.findAffectedPerson();
    AffectedPersonDto affectedPersonDto =
        PersonMapper.mapToAffectedPersonDto(
            personClient.getPersonFileState(person.getCentralFileStateId()), person.getVersion());
    if (omsProcedure.getProcedureStatus() == ProcedureStatus.OPEN
        && omsProcedure.isSendEmailNotifications()
        && !affectedPersonDto.emailAddresses().isEmpty()
        && omsDocument.getDocumentStatus() == OmsDocumentStatus.MISSING
        && !oldIsUploadInCitizenPortal
        && newIsUploadInCitizenPortal) {
      notificationService.notifyNewDocument(
          affectedPersonDto,
          omsDocument.getDocumentType(Language.GERMAN),
          omsDocument.getHelpText(Language.GERMAN));
    }
  }

  @Transactional
  public void completeDocumentFileUploadEmployee(
      UUID documentId, List<MultipartFile> files, String note) {
    OmsDocument omsDocument = loadOmsDocument(documentId);

    if (omsDocument.getOmsProcedure().isFinalized()) {
      throw new BadRequestException(
          "File upload cannot be completed when the procedure is finalized.");
    }
    if (omsDocument.getDocumentStatus() == OmsDocumentStatus.ACCEPTED) {
      throw new BadRequestException("Files can not be uploaded twice");
    }
    List<File> parsedFiles = validateAndParseFiles(files);

    saveFiles(omsDocument, parsedFiles);
    omsDocument.setReasonForRejection(null);
    omsDocument.setDocumentStatus(OmsDocumentStatus.ACCEPTED);
    omsDocument.setLastDocumentUpload(Instant.now(clock));
    omsDocument.setNote(note);
    omsDocument.setUploadedBy(DocumentUploadedBy.INTERN);

    OmsProcedure omsProcedure = omsDocument.getOmsProcedure();
    progressEntryService.createProgressEntryCompleteDocumentFileUploadEmployee(
        omsProcedure, omsDocument);
  }

  @Transactional
  public void uploadFilesToDocumentCitizen(UUID documentId, List<MultipartFile> files) {
    OmsDocument omsDocument = loadOmsDocument(documentId);

    if (omsDocument.getDocumentStatus() == OmsDocumentStatus.ACCEPTED) {
      throw new BadRequestException("Files can not be uploaded to a document in accepted state");
    }
    List<File> parsedFiles = validateAndParseFiles(files);

    saveFiles(omsDocument, parsedFiles);
    omsDocument.setReasonForRejection(null);
    omsDocument.setDocumentStatus(OmsDocumentStatus.SUBMITTED);
    omsDocument.setLastDocumentUpload(Instant.now(clock));
    omsDocument.setUploadedBy(DocumentUploadedBy.EXTERN);

    UUID physicianId = omsDocument.getOmsProcedure().getPhysicianId();
    if (physicianId != null) {
      procedureNotificationService.addNotification(
          new ProcedureNotification(
              physicianId,
              "Neues Dokument",
              "Ein Dokument liegt zur Prüfung vor.",
              omsDocument.getOmsProcedure().getExternalId()));
    }
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
    OmsProcedure procedure = document.getOmsProcedure();

    if (procedure.isFinalized()) {
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
        if (document.isUploadInCitizenPortal() && procedure.isSendEmailNotifications()) {
          sendReviewDocumentEmail(document);
        }
        progressEntryService.createProgressEntryForReviewDocument(procedure, document);
        break;
      case REJECTED:
        if (isBlank(request.reasonForRejection())) {
          throw new BadRequestException("reasonForRejection must not be blank");
        }
        deleteAllFiles(document);
        document.setUploadedBy(null);
        document.setReasonForRejection(request.reasonForRejection());
        document.setDocumentStatus(OmsDocumentStatus.REJECTED);
        if (document.isUploadInCitizenPortal() && procedure.isSendEmailNotifications()) {
          sendReviewDocumentEmail(document);
        }
        progressEntryService.createProgressEntryForReviewDocument(procedure, document);
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

  private List<File> validateAndParseFiles(List<MultipartFile> files) {
    return files.stream()
        .map(
            file -> {
              validateFileType(file);
              try {
                return validateAndParseFile(file, 5_000);
              } catch (IOException e) {
                throw new RuntimeException("Error while parsing file: ", e);
              }
            })
        .toList();
  }

  private void validateFileType(MultipartFile file) {
    List<String> allowedFileTypes =
        List.of(APPLICATION_PDF_VALUE, IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE);

    String contentType = file.getContentType();
    if (!allowedFileTypes.contains(contentType)) {
      throw new BadRequestException(
          "Invalid file type: " + contentType + ". Only PDF, JPG, and PNG are allowed.");
    }
  }

  private void saveFiles(OmsDocument omsDocument, List<File> files) {
    for (File file : files) {
      OmsFile omsFile = new OmsFile();
      omsFile.setFileName(file.getFileName());
      omsFile.setContent(file.getFileContent().getContent());
      omsFile.setFileType(getFileType(file.getFileType()));
      omsFile.setCreatedDate(Instant.now(clock));
      omsFile.setDocument(omsDocument);

      omsFileRepository.save(omsFile);
      omsDocument.getFiles().add(omsFile);
    }
  }

  private FileTypeDto getFileType(ProcedureFileType contentType) {
    if (contentType == null) {
      throw new BadRequestException("Content type is missing or empty.");
    }

    return switch (contentType) {
      case ProcedureFileType.PDF -> FileTypeDto.PDF;
      case ProcedureFileType.JPEG -> FileTypeDto.JPEG;
      case ProcedureFileType.PNG -> FileTypeDto.PNG;
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

  private void sendReviewDocumentEmail(OmsDocument document) {
    Person person = document.getOmsProcedure().findAffectedPerson();
    AffectedPersonDto affectedPersonDto =
        PersonMapper.mapToAffectedPersonDto(
            personClient.getPersonFileState(person.getCentralFileStateId()), person.getVersion());
    String documentType = document.getDocumentType(Language.GERMAN);
    if (document.getHelpText(Language.GERMAN) != null
        && !document.getHelpText(Language.GERMAN).isBlank()) {
      documentType += " - " + document.getHelpText(Language.GERMAN);
    }
    if (document.getDocumentStatus() == OmsDocumentStatus.ACCEPTED) {
      notificationService.notifyReviewDocumentAccepted(affectedPersonDto, documentType);
    } else if (document.getDocumentStatus() == OmsDocumentStatus.REJECTED) {
      notificationService.notifyReviewDocumentRejected(
          affectedPersonDto, documentType, document.getReasonForRejection());
    }
  }
}

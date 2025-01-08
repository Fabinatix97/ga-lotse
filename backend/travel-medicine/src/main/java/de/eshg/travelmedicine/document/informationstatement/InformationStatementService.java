/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.informationstatement;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.lib.procedure.util.FileValidator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.citizenauth.api.PatchInformationStatementRequest;
import de.eshg.travelmedicine.citizenpublic.DepartmentInfoService;
import de.eshg.travelmedicine.document.DocumentModifier;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.informationstatement.api.InformationStatementDto;
import de.eshg.travelmedicine.document.informationstatement.persistence.entity.InformationStatement;
import de.eshg.travelmedicine.notification.NotificationService;
import de.eshg.travelmedicine.signature.SignatureValidator;
import de.eshg.travelmedicine.signature.persistence.SignatureRepository;
import de.eshg.travelmedicine.signature.persistence.entity.TravelMedicineSignature;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplate;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplateRepository;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplateState;
import de.eshg.travelmedicine.vaccinationconsultation.PersonClient;
import de.eshg.travelmedicine.vaccinationconsultation.ProcedureAccessor;
import de.eshg.travelmedicine.vaccinationconsultation.ProgressEntryService;
import de.eshg.travelmedicine.vaccinationconsultation.VaccinationConsultationService;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetInformationStatementsResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostInformationStatementsRequest;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.CreatedByUserType;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import jakarta.validation.ValidationException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.multipart.MultipartFile;

@Service
public class InformationStatementService {
  public static final String INFORMATION_STATEMENT_PDF_TEMPLATE =
      "/pdf_templates/information_statement_pdf_template.ftlx";

  private final ProcedureAccessor procedureAccessor;
  private final InformationStatementTemplateRepository informationStatementTemplateRepository;
  private final InformationStatementMapper informationStatementMapper;
  private final InformationStatementFactory informationStatementFactory;
  private final NotificationService notificationService;
  private final VaccinationConsultationService vaccinationConsultationService;
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final ClassPathResource informationStatementResource;
  private final PersonClient personClient;
  private final Clock clock;
  private final DepartmentInfoService departmentInfoService;
  private final DocumentGenerator documentGenerator;
  private final SignatureRepository signatureRepository;
  private final ProgressEntryService progressEntryService;

  public InformationStatementService(
      ProcedureAccessor procedureAccessor,
      InformationStatementTemplateRepository informationStatementTemplateRepository,
      InformationStatementMapper informationStatementMapper,
      InformationStatementFactory informationStatementFactory,
      NotificationService notificationService,
      @Value(INFORMATION_STATEMENT_PDF_TEMPLATE) ClassPathResource informationStatementResource,
      VaccinationConsultationService vaccinationConsultationService,
      PersonClient personClient,
      Clock clock,
      DepartmentInfoService departmentInfoService,
      DocumentGenerator documentGenerator,
      SignatureRepository signatureRepository,
      ProgressEntryService progressEntryService) {
    this.progressEntryService = progressEntryService;
    Assert.isTrue(
        informationStatementResource.exists(), informationStatementResource + " does not exist");
    this.procedureAccessor = procedureAccessor;
    this.informationStatementTemplateRepository = informationStatementTemplateRepository;
    this.informationStatementMapper = informationStatementMapper;
    this.informationStatementFactory = informationStatementFactory;
    this.notificationService = notificationService;
    this.vaccinationConsultationService = vaccinationConsultationService;
    this.informationStatementResource = informationStatementResource;
    this.personClient = personClient;
    this.clock = clock;
    this.departmentInfoService = departmentInfoService;
    this.documentGenerator = documentGenerator;
    this.signatureRepository = signatureRepository;
  }

  public DocumentContentDto getInformationStatementForCitizenPortal(
      UUID citizenUserId, UUID informationStatementId) {
    InformationStatement informationStatement =
        findInformationStatement(citizenUserId, informationStatementId);

    if (informationStatement.isCitizenHasAnswered()) {
      throw new BadRequestException("Information statement already answered.");
    }

    return informationStatementMapper
        .mapInformationStatementToInterfaceType(informationStatement)
        .content();
  }

  public GetInformationStatementsResponse getInformationStatementsForEmployeePortal(
      UUID procedureId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);

    List<InformationStatementDto> informationStatements =
        informationStatementMapper.mapInformationStatementsToInterfaceType(
            vaccinationConsultation.getInformationStatements());
    return new GetInformationStatementsResponse(procedureId, informationStatements);
  }

  private InformationStatement findInformationStatement(
      UUID citizenUserId, UUID informationStatementId) {
    return procedureAccessor.accessInformationStatement(
        informationStatementId,
        null,
        List.of(new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));
  }

  public void patchInformationStatementForCitizenPortal(
      UUID citizenUserId,
      UUID informationStatementId,
      PatchInformationStatementRequest patchInformationStatementRequest,
      MultipartFile signature) {

    InformationStatement statementToPatch =
        findInformationStatement(citizenUserId, informationStatementId);

    if (statementToPatch.isCitizenHasAnswered()) {
      throw new BadRequestException("Information statement already answered.");
    }

    statementToPatch.setContent(
        toJsonString(patchInformationStatementRequest.documentContentDto()));
    statementToPatch.setCitizenHasAnswered(true);

    if (signature != null) {
      MediaType mediaType = FileValidator.validate(signature);
      if (MediaType.IMAGE_PNG != mediaType) {
        throw new BadRequestException("Signature must be media type image/png");
      }
      try {
        TravelMedicineSignature travelMedicineSignature =
            new TravelMedicineSignature(
                patchInformationStatementRequest.signer(), signature.getBytes());
        signatureRepository.save(travelMedicineSignature);
        SignatureValidator.generateSignatureHash(travelMedicineSignature);
        statementToPatch.setSignature(travelMedicineSignature);
      } catch (IOException e) {
        throw new UncheckedIOException(e);
      }
    }

    progressEntryService.createProgressEntryForAnswerInformationStatementByCitizen(
        statementToPatch.getVaccinationConsultation(), statementToPatch.getTitle());
  }

  public List<UUID> addInformationStatements(
      UUID procedureId, PostInformationStatementsRequest request) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.checkNotClosed);

    List<InformationStatement> newStatements =
        request.templateIds().stream()
            .map(
                templateID -> {
                  InformationStatementTemplate template =
                      informationStatementTemplateRepository
                          .findById(templateID)
                          .orElseThrow(() -> new NotFoundException("No such template"));
                  if (template.getState() != InformationStatementTemplateState.FINAL)
                    throw new BadRequestException(
                        "The template can't be used until it's in its FINAL state.");
                  return template;
                })
            .map(informationStatementFactory::createInformationStatement)
            .toList();

    vaccinationConsultation.getInformationStatements().addAll(newStatements);
    newStatements.forEach(
        s -> {
          s.setVaccinationConsultation(vaccinationConsultation);
          progressEntryService.createProgressEntryForAddInformationStatement(
              vaccinationConsultation, s.getTitle());
        });
    if (vaccinationConsultation.getCreatedBy() == CreatedByUserType.CITIZEN_PORTAL) {
      notificationService.notifyNewInformationStatement(
          vaccinationConsultationService.patientOf(vaccinationConsultation));
    }
    informationStatementTemplateRepository.flush();
    return newStatements.stream().map(InformationStatement::getId).toList();
  }

  public void deleteInformationStatement(UUID procedureId, UUID informationStatementId) {
    InformationStatement informationStatement =
        procedureAccessor.accessInformationStatement(
            informationStatementId, procedureId, ProcedureAccessor.checkNotClosed);

    VaccinationConsultation vaccinationConsultation =
        informationStatement.getVaccinationConsultation();

    vaccinationConsultation.getInformationStatements().remove(informationStatement);

    progressEntryService.createProgressEntryForRemoveInformationStatement(
        vaccinationConsultation, informationStatement.getTitle());
  }

  public void resetInformationStatement(UUID procedureId, UUID informationStatementId) {
    InformationStatement informationStatement =
        procedureAccessor.accessInformationStatement(
            informationStatementId, procedureId, ProcedureAccessor.checkNotClosed);

    String content = informationStatement.getContent();
    String wiped = DocumentModifier.wiper().modifyContent(content);
    informationStatement.setContent(wiped);
    informationStatement.setCitizenHasAnswered(false);
    informationStatement.setSignature(null);

    progressEntryService.createProgressEntryForResetInformationStatement(
        informationStatement.getVaccinationConsultation(), informationStatement.getTitle());
  }

  private String toJsonString(Object content) {
    try {
      return objectMapper.writeValueAsString(content);
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Content does not match required structure");
    }
  }

  public ResponseEntity<byte[]> createInformationStatementPdf(
      UUID procedureId, UUID informationStatementId) {
    InformationStatement informationStatement =
        procedureAccessor.accessInformationStatement(
            informationStatementId, procedureId, ProcedureAccessor.noChecks);

    Pdf certificateFile = generateInformationStatementPdf(informationStatement);
    ContentDisposition contentDisposition =
        ContentDisposition.attachment()
            .filename(certificateFile.getFileName(), StandardCharsets.UTF_8)
            .build();

    return ResponseEntity.ok()
        .contentType(certificateFile.getFileType().getCommonFileType().getMediaType())
        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
        .body(certificateFile.getFileContent().getContent());
  }

  private Pdf generateInformationStatementPdf(InformationStatement informationStatement) {
    TravelMedicineSignature signature = informationStatement.getSignature();
    if (!SignatureValidator.verifySignature(signature)) {
      throw new ValidationException("Signature is not valid");
    }

    VaccinationConsultation vaccinationConsultation =
        informationStatement.getVaccinationConsultation();
    UUID patientId = vaccinationConsultation.getPatientIdsFromCentralFile().getFirst();
    PatientDto patient = personClient.getPatientFromCentralFile(patientId);

    InformationStatementDto informationStatementDto =
        informationStatementMapper.mapInformationStatementToInterfaceType(informationStatement);

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    String signatureAsBase64 = null;
    String createdAt = null;
    if (signature != null) {
      signatureAsBase64 =
          signature.getSignatureImage() != null
              ? Base64.getEncoder().encodeToString(signature.getSignatureImage())
              : null;
      if (signature.getCreatedAt() != null) {
        ZonedDateTime zonedDateTime = signature.getCreatedAt().atZone(ZoneId.systemDefault());
        createdAt = formatter.format(zonedDateTime);
      }
    }

    InformationStatementPdfParameters pdfParameters =
        new InformationStatementPdfParameters(
            departmentInfoService.getDepartmentInfo(),
            departmentInfoService.getDepartmentLogo(),
            patient.firstName(),
            patient.lastName(),
            patient.dateOfBirth().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")),
            informationStatementDto.title(),
            informationStatementDto.content(),
            createdAt,
            signatureAsBase64);

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    documentGenerator.createPdfFromTemplate(informationStatementResource, pdfParameters, baos);
    byte[] bytes = baos.toByteArray();

    PdfMetaData pdfMetaData = new PdfMetaData();
    pdfMetaData.setCreatedDate(Instant.now(clock));

    return FileFactory.createPdfWithMetaData(pdfParameters.getFileName(), bytes, pdfMetaData);
  }
}

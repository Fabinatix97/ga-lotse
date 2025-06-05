/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.medicalhistory;

import static de.eshg.travelmedicine.document.DocumentDtoHelper.isDocumentContentCompletelyAnswered;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentLogoClient;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.medicalhistory.api.MedicalHistoryDto;
import de.eshg.travelmedicine.document.medicalhistory.api.PatchMedicalHistoryRequest;
import de.eshg.travelmedicine.document.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.vaccinationconsultation.PersonClient;
import de.eshg.travelmedicine.vaccinationconsultation.ProcedureAccessor;
import de.eshg.travelmedicine.vaccinationconsultation.ProgressEntryService;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetMedicalHistoriesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class MedicalHistoryService {
  public static final String MEDICAL_HISTORY_PDF_TEMPLATE =
      "/pdf_templates/medical_history_pdf_template.ftlx";

  private final ProcedureAccessor procedureAccessor;
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final ClassPathResource medicalHistoryResource;
  private final PersonClient personClient;
  private final Clock clock;
  private final DepartmentInfoConfigService departmentInfoService;
  private final DepartmentLogoClient departmentLogoClient;
  private final DocumentGenerator documentGenerator;
  private final ProgressEntryService progressEntryService;

  public MedicalHistoryService(
      ProcedureAccessor procedureAccessor,
      @Value(MEDICAL_HISTORY_PDF_TEMPLATE) ClassPathResource medicalHistoryResource,
      PersonClient personClient,
      Clock clock,
      DepartmentInfoConfigService departmentInfoService,
      DepartmentLogoClient departmentLogoClient,
      DocumentGenerator documentGenerator,
      ProgressEntryService progressEntryService) {
    this.personClient = personClient;
    this.clock = clock;
    this.departmentInfoService = departmentInfoService;
    this.departmentLogoClient = departmentLogoClient;
    this.documentGenerator = documentGenerator;
    this.progressEntryService = progressEntryService;
    Assert.isTrue(medicalHistoryResource.exists(), medicalHistoryResource + " does not exist");
    this.procedureAccessor = procedureAccessor;
    this.medicalHistoryResource = medicalHistoryResource;
  }

  public GetMedicalHistoriesResponse getMedicalHistoriesForEmployeePortal(UUID procedureId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);

    List<MedicalHistoryDto> medicalHistories =
        vaccinationConsultation.getProcedureSteps().stream()
            .filter(ps -> ps.getMedicalHistory() != null)
            .map(ps -> MedicalHistoryMapper.toInterfaceType(ps.getMedicalHistory(), ps))
            .sorted(Comparator.comparing(MedicalHistoryDto::appointment))
            .toList();
    return new GetMedicalHistoriesResponse(
        vaccinationConsultation.getExternalId(), medicalHistories);
  }

  public DocumentContentDto getMedicalHistoryForCitizenPortal(
      UUID citizenUserId, UUID procedureId, UUID procedureStepId) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId,
            procedureId,
            List.of(
                new ProcedureAccessor.CheckNotClosed(),
                new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));

    if (procedureStep.getMedicalHistory().isCitizenHasAnswered()) {
      throw new BadRequestException("Medical history already answered.");
    }

    return MedicalHistoryMapper.contentToInterfaceType(procedureStep.getMedicalHistory());
  }

  public void patchMedicalHistoryForEmployeePortal(
      UUID medicalHistoryId, PatchMedicalHistoryRequest patchMedicalHistoryRequest) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(
            patchMedicalHistoryRequest.procedureId(), ProcedureAccessor.checkNotClosed);
    ProcedureStep procedureStep =
        vaccinationConsultation.getProcedureSteps().stream()
            .filter(ps -> ps.getMedicalHistory().getId().equals(medicalHistoryId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Medical history with given id not found"));
    MedicalHistory medicalHistory = procedureStep.getMedicalHistory();

    medicalHistory.setNote(patchMedicalHistoryRequest.note());
    boolean completelyAnswered =
        isDocumentContentCompletelyAnswered(patchMedicalHistoryRequest.medicalHistoryContent());
    medicalHistory.setCompletelyAnswered(completelyAnswered);

    String oldContent = medicalHistory.getContent();
    String newContent = toJsonString(patchMedicalHistoryRequest.medicalHistoryContent());
    if (!oldContent.equals(newContent)) {
      medicalHistory.setContent(newContent);
      medicalHistory.setCitizenHasAnswered(true);
      progressEntryService.createProgressEntryForAnswerMedicalHistoryByEmployee(
          vaccinationConsultation, procedureStep, completelyAnswered);
    }
  }

  public void patchMedicalHistoryForCitizenPortal(
      UUID citizenUserId,
      UUID procedureId,
      UUID procedureStepId,
      DocumentContentDto patchMedicalHistoryContent) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId,
            procedureId,
            List.of(
                new ProcedureAccessor.CheckNotClosed(),
                new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));
    MedicalHistory medicalHistory = procedureStep.getMedicalHistory();
    if (medicalHistory.isCitizenHasAnswered()) {
      throw new BadRequestException("Medical history already answered by citizen.");
    }

    medicalHistory.setContent(toJsonString(patchMedicalHistoryContent));
    boolean completelyAnswered = isDocumentContentCompletelyAnswered(patchMedicalHistoryContent);
    medicalHistory.setCompletelyAnswered(completelyAnswered);
    medicalHistory.setCitizenHasAnswered(true);

    progressEntryService.createProgressEntryForAnswerMedicalHistoryByCitizen(
        procedureStep.getVaccinationConsultation(), procedureStep, completelyAnswered);
  }

  private String toJsonString(Object content) {
    try {
      return objectMapper.writeValueAsString(content);
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Content does not match required structure");
    }
  }

  public ResponseEntity<byte[]> createMedicalHistoryPdf(UUID procedureId, UUID medicalHistoryId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);
    MedicalHistory medicalHistory =
        procedureAccessor.accessMedicalHistory(
            medicalHistoryId, procedureId, ProcedureAccessor.noChecks);

    Pdf certificateFile = generateMedicalHistoryPdf(medicalHistory, vaccinationConsultation);
    ContentDisposition contentDisposition =
        ContentDisposition.attachment()
            .filename(certificateFile.getFileName(), StandardCharsets.UTF_8)
            .build();

    return ResponseEntity.ok()
        .contentType(certificateFile.getFileType().getCommonFileType().getMediaType())
        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
        .body(certificateFile.getFileContent().getContent());
  }

  private Pdf generateMedicalHistoryPdf(
      MedicalHistory medicalHistory, VaccinationConsultation vaccinationConsultation) {
    UUID patientId = vaccinationConsultation.getPatientIdsFromCentralFile().getFirst();
    PatientDto patient = personClient.getPatientFromCentralFile(patientId);

    DocumentContentDto content = MedicalHistoryMapper.contentToInterfaceType(medicalHistory);

    MedicalHistoryPdfParameters pdfParameters =
        new MedicalHistoryPdfParameters(
            departmentInfoService.getDepartmentInfo(),
            departmentLogoClient.getDepartmentLogo(),
            patient.firstName(),
            patient.lastName(),
            patient.address() != null && patient.address().street() != null
                ? patient.address().street()
                : null,
            patient.address() != null && patient.address().houseNumber() != null
                ? patient.address().houseNumber()
                : null,
            patient.address() != null && patient.address().postalCode() != null
                ? patient.address().postalCode()
                : null,
            patient.address() != null && patient.address().city() != null
                ? patient.address().city()
                : null,
            patient.dateOfBirth().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")),
            patient.phoneNumbers() != null ? String.join(", ", patient.phoneNumbers()) : null,
            patient.emailAddresses() != null ? String.join(", ", patient.emailAddresses()) : null,
            vaccinationConsultation.getTravelStartDate() != null
                ? vaccinationConsultation
                    .getTravelStartDate()
                    .format(DateTimeFormatter.ofPattern("dd.MM.yyyy"))
                : null,
            vaccinationConsultation.getTravelType() != null
                ? vaccinationConsultation.getTravelType().getName()
                : null,
            vaccinationConsultation.getTravelDestinations(),
            vaccinationConsultation.getTravelTimeAmount() != null
                ? String.join(
                    " ",
                    vaccinationConsultation.getTravelTimeAmount().toString(),
                    vaccinationConsultation.getTravelTimeUnit().getName())
                : null,
            content);

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    documentGenerator.createPdfFromTemplate(medicalHistoryResource, pdfParameters, baos);
    byte[] bytes = baos.toByteArray();

    PdfMetaData pdfMetaData = new PdfMetaData();
    pdfMetaData.setCreatedDate(Instant.now(clock));

    return FileFactory.createPdfWithMetaData(pdfParameters.getFileName(), bytes, pdfMetaData);
  }
}

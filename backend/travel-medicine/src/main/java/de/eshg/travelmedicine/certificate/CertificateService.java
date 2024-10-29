/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.certificate;

import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.CERTIFICATE_FOR_HEALTH_INSURANCE;

import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.domain.repository.ProgressEntryRepository;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.certificate.api.CertificateDto;
import de.eshg.travelmedicine.certificate.api.GetCertificatesResponse;
import de.eshg.travelmedicine.certificate.api.PostPutCertificateRequest;
import de.eshg.travelmedicine.certificate.persistence.entity.Certificate;
import de.eshg.travelmedicine.certificate.persistence.entity.CertificateRepository;
import de.eshg.travelmedicine.citizenpublic.DepartmentInfoService;
import de.eshg.travelmedicine.vaccinationconsultation.PersonClient;
import de.eshg.travelmedicine.vaccinationconsultation.ProcedureAccessor;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherService;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStepRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ServiceRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VcService;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class CertificateService {
  public static final String CERTIFICATE_TEMPLATE =
      "/pdf_templates/certificate_for_health_insurance_template.ftlx";

  private final CertificateRepository certificateRepository;
  private final ProcedureStepRepository procedureStepRepository;
  private final PersonClient personClient;
  private final ClassPathResource certificateTemplateResource;
  private final DocumentGenerator documentGenerator;
  private final ServiceRepository serviceRepository;
  private final ProgressEntryRepository progressEntryRepository;
  private final Clock clock;
  private final ProcedureAccessor procedureAccessor;
  private final DepartmentInfoService departmentInfoService;

  public CertificateService(
      CertificateRepository certificateRepository,
      ProcedureStepRepository procedureStepRepository,
      PersonClient personClient,
      @Value(CERTIFICATE_TEMPLATE) ClassPathResource certificateTemplateResource,
      DocumentGenerator documentGenerator,
      ServiceRepository serviceRepository,
      ProgressEntryRepository progressEntryRepository,
      Clock clock,
      ProcedureAccessor procedureAccessor,
      DepartmentInfoService departmentInfoService) {
    Assert.isTrue(
        certificateTemplateResource.exists(), certificateTemplateResource + " does not exist");
    this.certificateRepository = certificateRepository;
    this.procedureStepRepository = procedureStepRepository;
    this.personClient = personClient;
    this.certificateTemplateResource = certificateTemplateResource;
    this.documentGenerator = documentGenerator;
    this.serviceRepository = serviceRepository;
    this.progressEntryRepository = progressEntryRepository;
    this.clock = clock;
    this.procedureAccessor = procedureAccessor;
    this.departmentInfoService = departmentInfoService;
  }

  public static final String PDF_FILENAME = "bescheinigung_krankenkasse.pdf";

  public GetCertificatesResponse getCertificates(UUID procedureId) {
    procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);

    List<CertificateDto> certificateDtos =
        certificateRepository.findCertificatesByProcedureId(procedureId).stream()
            .map(
                certificate -> {
                  // pdfCertificateFileId is just null in case the file has been soft-deleted
                  UUID pdfCertificateFileId =
                      this.retrieveFileIdOfProgressEntry(certificate.getProgressEntryId());
                  return CertificateMapper.toInterfaceType(certificate, pdfCertificateFileId);
                })
            .sorted(Comparator.comparing(CertificateDto::appointment))
            .toList();
    return new GetCertificatesResponse(certificateDtos);
  }

  public void createCertificate(UUID procedureId, PostPutCertificateRequest request) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            request.procedureStepId(), procedureId, ProcedureAccessor.checkNotClosed);

    List<VcService> services =
        serviceRepository.findAllByVaccinationConsultationExternalIdOrderById(procedureId);
    List<UUID> validServiceIds = services.stream().map(VcService::getId).toList();

    List<UUID> serviceIds = request.serviceIds();
    if (serviceIds.stream().anyMatch(id -> !validServiceIds.contains(id)))
      throw new BadRequestException(
          "At least one of the requested services does not belong to this vaccination consultation");

    UUID progressEntryId = generateProgressEntry(procedureStep, serviceIds);
    Certificate newCertificate =
        CertificateMapper.toEntityType(request.type(), procedureStep, progressEntryId);

    certificateRepository.saveAndFlush(newCertificate);
  }

  private UUID retrieveFileIdOfProgressEntry(UUID progressEntryId) {
    Optional<ProgressEntry> found = progressEntryRepository.findByExternalId(progressEntryId);
    if (found.isEmpty()) return null;

    File file = found.get().getFile();
    return (file.isDeleted() ? null : file.getExternalId());
  }

  private static String formatPdfVaccinationDescription(Vaccination vaccination) {
    return String.format("%s, %s", vaccination.getDiseaseName(), vaccination.getVaccineName());
  }

  private static List<PdfServiceParameters> assembleServiceParameters(List<VcService> services) {
    return services.stream()
        .map(
            service ->
                switch (service) {
                  case OtherService otherService ->
                      new PdfServiceParameters(
                          otherService.getDescription(), otherService.getFee());
                  case Vaccination vaccination ->
                      new PdfServiceParameters(
                          formatPdfVaccinationDescription(vaccination), vaccination.getFee());
                  case VcService anyVcService ->
                      new PdfServiceParameters("undefinierte Leistungsart", anyVcService.getFee());
                })
        .sorted(Comparator.comparing(PdfServiceParameters::getServiceDescriptor))
        .toList();
  }

  private static HealthInsuranceCertificatePdfParameters collectHealthInsuranceCertificatePdfData(
      DepartmentInfoService departmentInfoService,
      VaccinationConsultation vaccinationConsultation,
      PatientDto patientFromCentralFile,
      List<VcService> services) {

    List<PdfServiceParameters> serviceParameters = assembleServiceParameters(services);

    return new HealthInsuranceCertificatePdfParameters(
        departmentInfoService.getDepartmentInfo(),
        departmentInfoService.getDepartmentLogo(),
        (patientFromCentralFile.salutation() != null
            ? patientFromCentralFile.salutation().name()
            : ""),
        patientFromCentralFile.firstName(),
        patientFromCentralFile.lastName(),
        (patientFromCentralFile.address() != null ? patientFromCentralFile.address().street() : ""),
        (patientFromCentralFile.address() != null
            ? patientFromCentralFile.address().houseNumber()
            : ""),
        (patientFromCentralFile.address() != null
            ? patientFromCentralFile.address().addressAddition()
            : ""),
        (patientFromCentralFile.address() != null
            ? patientFromCentralFile.address().postalCode()
            : ""),
        (patientFromCentralFile.address() != null ? patientFromCentralFile.address().city() : ""),
        (patientFromCentralFile.address() != null
            ? patientFromCentralFile.address().country().name()
            : ""),
        patientFromCentralFile.dateOfBirth().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")),
        (vaccinationConsultation.getTravelStartDate() != null
            ? vaccinationConsultation
                .getTravelStartDate()
                .format(DateTimeFormatter.ofPattern("dd.MM.yyyy"))
            : ""),
        vaccinationConsultation.getTravelType().getName(),
        vaccinationConsultation.getTravelDestinations(),
        (vaccinationConsultation.getTravelTimeAmount() != null
                && vaccinationConsultation.getTravelTimeUnit() != null
            ? String.join(
                " ",
                vaccinationConsultation.getTravelTimeAmount().toString(),
                vaccinationConsultation.getTravelTimeUnit().getName())
            : ""),
        serviceParameters);
  }

  private Pdf generateHealthInsuranceCertificateFile(
      ProcedureStep procedureStep, List<UUID> serviceIds) {
    List<VcService> services = serviceRepository.findAllByIdOrderById(serviceIds);

    UUID patientId =
        procedureStep.getVaccinationConsultation().getPatientIdsFromCentralFile().getFirst();
    PatientDto patient = personClient.getPersonFromCentralFile(patientId).patient();
    VaccinationConsultation consultation = procedureStep.getVaccinationConsultation();

    HealthInsuranceCertificatePdfParameters pdfParameters =
        collectHealthInsuranceCertificatePdfData(
            departmentInfoService, consultation, patient, services);

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    documentGenerator.createPdfFromTemplate(certificateTemplateResource, pdfParameters, baos);
    byte[] bytes = baos.toByteArray();

    PdfMetaData pdfMetaData = new PdfMetaData();
    pdfMetaData.setCreatedDate(Instant.now(clock));
    pdfMetaData.setDescription(pdfParameters.getTitle());

    return FileFactory.createPdfWithMetaData(
        PDF_FILENAME, ProcedureFileType.PDF, bytes, pdfMetaData, false);
  }

  private UUID generateProgressEntry(ProcedureStep procedureStep, List<UUID> serviceIds) {
    Pdf certificateFile = generateHealthInsuranceCertificateFile(procedureStep, serviceIds);

    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            CERTIFICATE_FOR_HEALTH_INSURANCE.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setFile(certificateFile);
    progressEntry.setProcedureId(procedureStep.getVaccinationConsultation().getId());
    procedureStep.getVaccinationConsultation().addProgressEntry(progressEntry);
    procedureStepRepository.flush();
    return progressEntry.getExternalId();
  }
}

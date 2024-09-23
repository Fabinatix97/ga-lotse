/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.client.ContactClient;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.lib.procedure.domain.model.FileType;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.schoolentry.api.CreateSchoolInfoLetterRequest;
import de.eshg.schoolentry.business.model.ProcedureDetailsData;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.pdf.Address;
import de.eshg.schoolentry.pdf.ReportGeneratorConstants;
import de.eshg.schoolentry.pdf.schoolinfoletter.model.*;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.jetbrains.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class SchoolInfoLetterGenerator {

  static final String SCHOOL_INFO_LETTER_TEMPLATE = "/templates/school_info_letter.ftlh";

  private final ClassPathResource schoolInfoLetterTemplate;
  private final DepartmentClient departmentClient;
  private final ContactClient contactClient;
  private final SchoolInfoLetterExaminationMapper schoolInfoLetterExaminationMapper;
  private final DocumentGenerator documentGenerator;
  private final Clock clock;

  public SchoolInfoLetterGenerator(
      @Value(SCHOOL_INFO_LETTER_TEMPLATE) ClassPathResource schoolInfoLetterTemplate,
      DepartmentClient departmentClient,
      ContactClient contactClient,
      DocumentGenerator documentGenerator,
      Clock clock,
      SchoolInfoLetterExaminationMapper schoolInfoLetterExaminationMapper) {
    this.contactClient = contactClient;
    this.schoolInfoLetterExaminationMapper = schoolInfoLetterExaminationMapper;
    Assert.isTrue(
        schoolInfoLetterTemplate.exists(), () -> schoolInfoLetterTemplate + " does not exist");
    this.schoolInfoLetterTemplate = schoolInfoLetterTemplate;
    this.departmentClient = departmentClient;
    this.documentGenerator = documentGenerator;
    this.clock = clock;
  }

  public Pdf generateSchoolInfoLetter(
      SchoolEntryProcedure procedure,
      ProcedureDetailsData procedureDetailsData,
      CreateSchoolInfoLetterRequest request) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    SchoolInfoLetterData templateData =
        buildSchoolInfoLetterData(procedure, procedureDetailsData, request);
    documentGenerator.createPdfFromTemplate(schoolInfoLetterTemplate, templateData, baos);

    PdfMetaData pdfMetaData = new PdfMetaData();
    ZonedDateTime now = ZonedDateTime.now(clock);
    pdfMetaData.setCreatedDate(now.toInstant());
    pdfMetaData.setDescription("Schulinfobrief");
    String filename =
        "Schulinfobrief_%s.pdf"
            .formatted(now.format(ReportGeneratorConstants.FILENAME_TIMESTAMP_FORMAT));
    return FileFactory.createPdfWithMetaData(
        filename, FileType.PDF, baos.toByteArray(), pdfMetaData, false);
  }

  @VisibleForTesting
  SchoolInfoLetterData buildSchoolInfoLetterData(
      SchoolEntryProcedure procedure,
      ProcedureDetailsData procedureDetailsData,
      CreateSchoolInfoLetterRequest request) {
    Address departmentAddress = fetchDepartmentAddress();
    Address schoolAddress = fetchSchoolAddress(procedureDetailsData.school().id());
    DepartmentLogo departmentLogo = departmentClient.getDepartmentLogo();
    return new SchoolInfoLetterData(
        LocalDate.now(clock).format(DateTimeFormatter.ofPattern("dd.MM.yyyy")),
        departmentLogo,
        departmentAddress,
        schoolAddress,
        schoolInfoLetterExaminationMapper.mapToData(procedure, procedureDetailsData, request));
  }

  private Address fetchDepartmentAddress() {
    GetDepartmentInfoResponse departmentInfo = departmentClient.getDepartmentInfo();
    return new Address(
        departmentInfo.name(),
        departmentInfo.street() + " " + departmentInfo.houseNumber(),
        departmentInfo.postalCode(),
        departmentInfo.city(),
        departmentInfo.phoneNumber(),
        departmentInfo.homepage(),
        null,
        departmentInfo.email());
  }

  private Address fetchSchoolAddress(UUID schoolId) {
    ContactDto school = contactClient.getContact(schoolId);

    Assert.notNull(school, () -> "School not found");

    return switch (school.contactAddress()) {
      case DomesticAddressDto domesticAddress ->
          new Address(
              school.name(),
              domesticAddress.street() + " " + domesticAddress.houseNumber(),
              domesticAddress.postalCode(),
              domesticAddress.city(),
              null,
              null,
              domesticAddress.addressAddition(),
              null);
      case PostboxAddressDto postboxAddress ->
          new Address(
              postboxAddress.postbox(),
              postboxAddress.differentName(),
              postboxAddress.postalCode(),
              postboxAddress.city(),
              null,
              null,
              null,
              null);
    };
  }
}

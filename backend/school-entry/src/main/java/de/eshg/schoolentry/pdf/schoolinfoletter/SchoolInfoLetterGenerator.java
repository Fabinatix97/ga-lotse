/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter;

import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.schoolentry.api.CreateSchoolInfoLetterRequest;
import de.eshg.schoolentry.business.model.ProcedureDetailsData;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.pdf.AbstractGenerator;
import de.eshg.schoolentry.pdf.Address;
import de.eshg.schoolentry.pdf.ReportGeneratorConstants;
import de.eshg.schoolentry.pdf.schoolinfoletter.model.*;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import org.jetbrains.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class SchoolInfoLetterGenerator extends AbstractGenerator {

  static final String SCHOOL_INFO_LETTER_TEMPLATE = "/templates/school_info_letter.ftlh";

  private final ClassPathResource schoolInfoLetterTemplate;
  private final DepartmentClient departmentClient;
  private final SchoolInfoLetterExaminationMapper schoolInfoLetterExaminationMapper;
  private final DocumentGenerator documentGenerator;
  private final Clock clock;

  public SchoolInfoLetterGenerator(
      @Value(SCHOOL_INFO_LETTER_TEMPLATE) ClassPathResource schoolInfoLetterTemplate,
      DepartmentInfoConfigService departmentInfoConfigService,
      DepartmentClient departmentClient,
      ContactClient contactClient,
      DocumentGenerator documentGenerator,
      Clock clock,
      SchoolInfoLetterExaminationMapper schoolInfoLetterExaminationMapper) {
    super(departmentInfoConfigService, contactClient);
    this.departmentClient = departmentClient;
    this.schoolInfoLetterExaminationMapper = schoolInfoLetterExaminationMapper;
    Assert.isTrue(
        schoolInfoLetterTemplate.exists(), () -> schoolInfoLetterTemplate + " does not exist");
    this.schoolInfoLetterTemplate = schoolInfoLetterTemplate;
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
    return FileFactory.createPdfWithMetaData(filename, baos.toByteArray(), pdfMetaData);
  }

  @VisibleForTesting
  SchoolInfoLetterData buildSchoolInfoLetterData(
      SchoolEntryProcedure procedure,
      ProcedureDetailsData procedureDetailsData,
      CreateSchoolInfoLetterRequest request) {
    Address departmentAddress = getDepartmentAddress();
    Address schoolAddress = getAddressOfInstitution(procedureDetailsData.school().id());
    DepartmentLogo departmentLogo = departmentClient.getDepartmentLogo();
    return new SchoolInfoLetterData(
        LocalDate.now(clock).format(DateTimeFormatter.ofPattern("dd.MM.yyyy")),
        departmentLogo,
        departmentAddress,
        schoolAddress,
        schoolInfoLetterExaminationMapper.mapToData(procedure, procedureDetailsData, request));
  }
}

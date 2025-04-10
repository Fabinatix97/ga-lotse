/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.medicalreport;

import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.schoolentry.api.CreateMedicalReportRequest;
import de.eshg.schoolentry.business.model.PersonDetailsData;
import de.eshg.schoolentry.pdf.AbstractGenerator;
import de.eshg.schoolentry.pdf.Address;
import de.eshg.schoolentry.pdf.ReportGeneratorConstants;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.ZonedDateTime;
import org.jetbrains.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class MedicalReportGenerator extends AbstractGenerator {

  static final String MEDICAL_REPORT_TEMPLATE = "/templates/medicalreport.ftlx";

  private final ClassPathResource medicalReportTemplate;
  private final DocumentGenerator documentGenerator;
  private final Clock clock;
  private final DepartmentClient departmentClient;

  public MedicalReportGenerator(
      @Value(MEDICAL_REPORT_TEMPLATE) ClassPathResource medicalReportTemplate,
      DepartmentClient departmentClient,
      DepartmentInfoConfigService departmentInfoConfigService,
      DocumentGenerator documentGenerator,
      Clock clock,
      ContactClient contactClient) {
    super(departmentInfoConfigService, contactClient);
    this.departmentClient = departmentClient;
    Assert.isTrue(medicalReportTemplate.exists(), () -> medicalReportTemplate + " does not exist");
    this.medicalReportTemplate = medicalReportTemplate;
    this.documentGenerator = documentGenerator;
    this.clock = clock;
  }

  @VisibleForTesting
  MedicalReportData buildMedicalReportData(
      PersonDetailsData child, CreateMedicalReportRequest request) {
    Address departmentAddress = getDepartmentAddress();
    DepartmentLogo departmentLogo = departmentClient.getDepartmentLogo();

    MedicalReportChild medicalReportChild =
        new MedicalReportChild(
            concat(child.firstName(), child.lastName()),
            child.dateOfBirth().format(ReportGeneratorConstants.DATE_FORMAT_DE));
    return new MedicalReportData(
        departmentLogo, departmentAddress, medicalReportChild, request.remark(), request.isVisio());
  }

  private static String concat(String... strings) {
    return String.join(" ", strings);
  }

  public Pdf generateMedicalReport(
      PersonDetailsData childData, CreateMedicalReportRequest request) {
    MedicalReportData medicalReportData = buildMedicalReportData(childData, request);
    return generateMedicalReport(medicalReportData);
  }

  private Pdf generateMedicalReport(MedicalReportData medicalReportData) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    documentGenerator.createPdfFromTemplate(medicalReportTemplate, medicalReportData, baos);
    byte[] bytes = baos.toByteArray();

    String addressee = medicalReportData.isVisio() ? "Augenarztbrief" : "Arztbrief";
    PdfMetaData pdfMetaData = new PdfMetaData();
    ZonedDateTime now = ZonedDateTime.now(clock);
    pdfMetaData.setCreatedDate(now.toInstant());
    pdfMetaData.setDescription(addressee + " " + medicalReportData.child().name());
    String filename =
        "%s_%s_%s.pdf"
            .formatted(
                addressee,
                medicalReportData.child().name().replace(" ", "_"),
                now.format(ReportGeneratorConstants.FILENAME_TIMESTAMP_FORMAT));
    return FileFactory.createPdfWithMetaData(filename, bytes, pdfMetaData);
  }
}

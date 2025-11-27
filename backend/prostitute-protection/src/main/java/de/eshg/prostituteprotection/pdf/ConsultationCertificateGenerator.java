/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.pdf;

import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentLogoClient;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import java.time.Clock;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class ConsultationCertificateGenerator extends AbstractGenerator {

  static final String CONSULTATION_CERTIFICATE_TEMPLATE =
      "/templates/consultation_certificate.ftlh";

  public ConsultationCertificateGenerator(
      @Value(CONSULTATION_CERTIFICATE_TEMPLATE) ClassPathResource certificateTemplate,
      DepartmentLogoClient departmentLogoClient,
      DepartmentInfoConfigService departmentInfoConfigService,
      DocumentGenerator documentGenerator,
      Clock clock) {
    super(
        certificateTemplate,
        departmentLogoClient,
        departmentInfoConfigService,
        documentGenerator,
        clock);
  }

  public Pdf generateConsultationCertificate(ProstituteProtectionProcedure procedure) {
    return generatePdf(
        buildConsultationCertificateData(procedure), PrintDocumentType.CONSULTATION_CERTIFICATE);
  }

  ConsultationCertificateData buildConsultationCertificateData(
      ProstituteProtectionProcedure procedure) {
    LocalDate consultationDate = toLocalDate(procedure.getAppointmentStart());
    LocalDate validToDate =
        calculateValidToDate(
            consultationDate, procedure.getEncryptedPersonalData().getDateOfBirth());

    return new ConsultationCertificateData(
        getPersonData(procedure),
        getFormattedDate(consultationDate),
        getFormattedDate(validToDate),
        procedure.getEncryptedPersonalData().getDocumentType().getDescription(),
        getDepartmentData());
  }

  static LocalDate calculateValidToDate(LocalDate consultationDate, LocalDate dateOfBirth) {
    if (consultationDate.minusYears(21).isBefore(dateOfBirth)) {
      return consultationDate.plusMonths(6);
    } else {
      return consultationDate.plusYears(1);
    }
  }
}

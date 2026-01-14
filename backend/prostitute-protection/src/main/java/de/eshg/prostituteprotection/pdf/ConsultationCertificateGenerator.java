/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.pdf;

import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentLogoClient;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import java.time.Clock;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
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

  public ByteArrayResource generateConsultationCertificate(
      ProstituteProtectionProcedure procedure,
      DecryptedPersonalDataDto decryptedPersonalDataDto,
      boolean withAlias) {
    return generateByteArrayResource(
        buildConsultationCertificateData(procedure, decryptedPersonalDataDto, withAlias),
        PrintDocumentType.CONSULTATION_CERTIFICATE);
  }

  ConsultationCertificateData buildConsultationCertificateData(
      ProstituteProtectionProcedure procedure,
      DecryptedPersonalDataDto decryptedPersonalDataDto,
      boolean withAlias) {
    LocalDate consultationDate = toLocalDate(procedure.getAppointmentStart());
    LocalDate validToDate =
        calculateValidToDate(consultationDate, decryptedPersonalDataDto.dateOfBirth());

    return new ConsultationCertificateData(
        getPersonData(procedure, decryptedPersonalDataDto, withAlias),
        getFormattedDate(consultationDate),
        getFormattedDate(validToDate),
        procedure.getPersonalData().getDocumentType().getDescription(),
        procedure.getConsultation().isReferral(),
        procedure.getConsultation().isClearing(),
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

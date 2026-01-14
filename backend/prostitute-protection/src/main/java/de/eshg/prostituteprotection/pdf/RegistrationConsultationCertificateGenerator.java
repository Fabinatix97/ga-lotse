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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class RegistrationConsultationCertificateGenerator extends AbstractGenerator {

  static final String REGISTRATION_CONSULTATION_CERTIFICATE_TEMPLATE =
      "/templates/registration_consultation_certificate.ftlh";

  public RegistrationConsultationCertificateGenerator(
      @Value(REGISTRATION_CONSULTATION_CERTIFICATE_TEMPLATE) ClassPathResource certificateTemplate,
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

  public ByteArrayResource generateRegistrationConsultationCertificate(
      ProstituteProtectionProcedure procedure,
      DecryptedPersonalDataDto decryptedPersonalDataDto,
      boolean withAlias) {
    return generateByteArrayResource(
        buildRegistrationConsultationCertificateData(
            procedure, decryptedPersonalDataDto, withAlias),
        PrintDocumentType.REGISTRATION_CONSULTATION_CERTIFICATE);
  }

  RegistrationConsultationCertificateData buildRegistrationConsultationCertificateData(
      ProstituteProtectionProcedure procedure,
      DecryptedPersonalDataDto decryptedPersonalDataDto,
      boolean withAlias) {
    String consultationDate = getFormattedDate(toLocalDate(procedure.getAppointmentStart()));
    return new RegistrationConsultationCertificateData(
        getPersonData(procedure, decryptedPersonalDataDto, withAlias),
        consultationDate,
        !procedure.getConsultation().isInterpreterConsulted(),
        procedure.getConsultation().isInterpreterConsulted(),
        getDepartmentData());
  }
}

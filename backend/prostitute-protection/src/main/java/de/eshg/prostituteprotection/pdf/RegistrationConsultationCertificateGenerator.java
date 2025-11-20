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
import org.springframework.beans.factory.annotation.Value;
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

  public Pdf generateRegistrationConsultationCertificate(ProstituteProtectionProcedure procedure) {
    return generatePdf(
        buildRegistrationConsultationCertificateData(procedure),
        "Beratungszertifikat Anmeldung",
        "Beratungszertifikat_Anmeldung");
  }

  RegistrationConsultationCertificateData buildRegistrationConsultationCertificateData(
      ProstituteProtectionProcedure procedure) {
    String consultationDate =
        getFormattedDate(toLocalDate(procedure.getAppointment().getAppointmentStart()));
    return new RegistrationConsultationCertificateData(
        getPersonData(procedure),
        consultationDate,
        !procedure.isWithTranslator(),
        procedure.isWithTranslator(),
        getDepartmentData());
  }
}

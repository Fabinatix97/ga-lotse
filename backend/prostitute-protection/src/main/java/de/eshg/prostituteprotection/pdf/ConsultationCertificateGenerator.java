/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.pdf;

import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.department.DepartmentLogoClient;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.domain.model.DocumentType;
import de.eshg.prostituteprotection.domain.model.PersonalData;
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
  private static final int YOUNG_ADULT_AGE = 21;
  private static final int REPEAT_AFTER_MONTHS = 6;
  private static final int REPEAT_AFTER_YEARS = 1;

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
    PersonalData personalData = procedure.getPersonalData();
    LocalDate validToDate =
        calculateValidToDate(
            consultationDate, decryptedPersonalDataDto.dateOfBirth(), personalData);

    String documentTypeDescription =
        personalData.getDocumentType() == DocumentType.OTHER
            ? personalData.getCustomDocumentType()
            : personalData.getDocumentType().getDescription();

    return new ConsultationCertificateData(
        getPersonData(procedure, decryptedPersonalDataDto, withAlias),
        getFormattedDate(consultationDate),
        getFormattedDate(validToDate),
        documentTypeDescription,
        procedure.getConsultation().isDiseasePrevention(),
        procedure.getConsultation().isBirthControl(),
        procedure.getConsultation().isPregnancy(),
        procedure.getConsultation().isAlcoholAndDrugUsage(),
        procedure.getConsultation().isReferral(),
        procedure.getConsultation().isClearing(),
        getDepartmentData());
  }

  public static LocalDate calculateValidToDate(
      LocalDate consultationDate, LocalDate dateOfBirth, PersonalData personalData) {
    LocalDate standardValidToDate;
    if (consultationDate.minusYears(YOUNG_ADULT_AGE).isBefore(dateOfBirth)) {
      standardValidToDate = consultationDate.plusMonths(REPEAT_AFTER_MONTHS);
    } else {
      standardValidToDate = consultationDate.plusYears(REPEAT_AFTER_YEARS);
    }

    if (personalData.getDocumentType() == DocumentType.RESIDENCE_PERMIT) {
      LocalDate residencePermitValidityDate = personalData.getResidencePermitValidityDate();
      if (residencePermitValidityDate.isBefore(standardValidToDate)) {
        standardValidToDate = residencePermitValidityDate;
      }
    }

    return standardValidToDate;
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.base.user.api.UserDto;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.lib.procedure.util.ProcedureValidator;
import de.eshg.prostituteprotection.api.AppointmentBookingTypeDto;
import de.eshg.prostituteprotection.api.ProcedureProperty;
import de.eshg.prostituteprotection.api.RequiredProcedureArea;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.crypto.EncryptedPersonalDataDto;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.DocumentType;
import de.eshg.prostituteprotection.domain.model.EncryptedPersonalData;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.rest.service.error.BadRequestException;
import io.micrometer.common.util.StringUtils;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ProstituteProtectionValidator {
  private ProstituteProtectionValidator() {}

  public static void validateConsultation(Consultation consultation) {
    if (consultation == null) {
      return;
    }
    if (!consultation.isInterpreterConsulted()
        && (StringUtils.isNotEmpty(consultation.getInterpreterFirstName())
            || StringUtils.isNotEmpty(consultation.getInterpreterLastName()))) {
      throw new BadRequestException(
          "Interpreters name cannot be set when interpreterConsulted is false.");
    }
  }

  public static void validateConsultantIsOfCorrectGroup(
      List<UserDto> consultantUsers, UUID requestedConsultant) {
    if (!consultantUsers.stream().map(UserDto::userId).toList().contains(requestedConsultant)) {
      throw new BadRequestException(
          "User with id %s does not belong to technical group %s"
              .formatted(
                  requestedConsultant,
                  TechnicalGroup.PROSTITUTE_PROTECTION_CONSULTANT.getKeycloakName()));
    }
  }

  public static Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> validateCompleteness(
      ProstituteProtectionProcedure procedure,
      boolean withAlias,
      boolean withRegistrationCertificate) {
    return validateCompleteness(procedure, null, withAlias, withRegistrationCertificate);
  }

  public static Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> validateCompleteness(
      ProstituteProtectionProcedure procedure,
      DecryptedPersonalDataDto personalData,
      boolean withAlias,
      boolean withRegistrationCertificate) {
    LinkedHashMap<RequiredProcedureArea, EnumSet<ProcedureProperty>> errors = new LinkedHashMap<>();

    putIfNotEmpty(
        errors, validateDetails(procedure, personalData, withAlias), RequiredProcedureArea.DETAILS);

    Consultation consultation = procedure.getConsultation();
    if (consultation == null) {
      throw new IllegalStateException(
          "Consultation for procedure %s should not be null".formatted(procedure.getExternalId()));
    }
    if (withRegistrationCertificate) {
      putIfNotEmpty(
          errors,
          validateConsultationParagraph7(consultation),
          RequiredProcedureArea.CONSULTATION_PARAGRAPH_7);
    }
    return errors;
  }

  private static void putIfNotEmpty(
      LinkedHashMap<RequiredProcedureArea, EnumSet<ProcedureProperty>> errors,
      EnumSet<ProcedureProperty> properties,
      RequiredProcedureArea area) {
    if (!properties.isEmpty()) {
      errors.put(area, properties);
    }
  }

  private static EnumSet<ProcedureProperty> validateDetails(
      ProstituteProtectionProcedure procedure,
      DecryptedPersonalDataDto personalData,
      boolean withAlias) {
    EnumSet<ProcedureProperty> properties = EnumSet.noneOf(ProcedureProperty.class);

    if (personalData != null) {
      addPropertyIfNull(properties, ProcedureProperty.FIRST_NAME, personalData.firstName());
      addPropertyIfNull(properties, ProcedureProperty.LAST_NAME, personalData.lastName());
      addPropertyIfNull(properties, ProcedureProperty.DATE_OF_BIRTH, personalData.dateOfBirth());
    } else {
      addPropertyIfNull(
          properties,
          ProcedureProperty.FIRST_NAME,
          procedure.getEncryptedPersonalData().getEncryptedData());
      addPropertyIfNull(
          properties,
          ProcedureProperty.LAST_NAME,
          procedure.getEncryptedPersonalData().getEncryptedData());
      addPropertyIfNull(
          properties,
          ProcedureProperty.DATE_OF_BIRTH,
          procedure.getEncryptedPersonalData().getEncryptedData());
    }

    if (withAlias) {
      addPropertyIfNull(
          properties, ProcedureProperty.ALIAS, procedure.getPersonalData().getAlias());
    }
    DocumentType documentType = procedure.getPersonalData().getDocumentType();
    addPropertyIfNull(properties, ProcedureProperty.DOCUMENT_TYPE, documentType);
    if (documentType == DocumentType.RESIDENCE_PERMIT) {
      addPropertyIfNull(
          properties,
          ProcedureProperty.RESIDENCE_PERMIT_VALIDITY_DATE,
          procedure.getPersonalData().getResidencePermitValidityDate());
    }
    if (documentType == DocumentType.OTHER) {
      addPropertyIfNull(
          properties,
          ProcedureProperty.CUSTOM_DOCUMENT_TYPE,
          procedure.getPersonalData().getCustomDocumentType());
    }

    return properties;
  }

  private static EnumSet<ProcedureProperty> validateConsultationParagraph7(
      Consultation consultation) {
    EnumSet<ProcedureProperty> properties = EnumSet.noneOf(ProcedureProperty.class);

    addPropertyIfFalse(properties, ProcedureProperty.LEGAL_ADVICES, consultation.isLegalAdvices());
    addPropertyIfFalse(
        properties,
        ProcedureProperty.HEALTH_AND_SOCIAL_INSURANCE,
        consultation.isHealthAndSocialInsurance());
    addPropertyIfFalse(
        properties, ProcedureProperty.CONSULTING_SERVICES, consultation.isConsultingServices());
    addPropertyIfFalse(
        properties, ProcedureProperty.EMERGENCY_HELP, consultation.isEmergencyHelp());
    addPropertyIfFalse(properties, ProcedureProperty.TAX_LIABILITY, consultation.isTaxLiability());
    return properties;
  }

  private static void addPropertyIfNull(
      EnumSet<ProcedureProperty> properties, ProcedureProperty procedureProperty, Object object) {
    if (object == null) {
      properties.add(procedureProperty);
    }
  }

  private static void addPropertyIfFalse(
      EnumSet<ProcedureProperty> properties,
      ProcedureProperty procedureProperty,
      boolean booleanObject) {
    if (!booleanObject) {
      properties.add(procedureProperty);
    }
  }

  static void validateConsultationCertificateCreated(ProstituteProtectionProcedure procedure) {
    if (procedure.getConsultationCertificateCreatedAt() == null) {
      throw new BadRequestException(
          "A consultation certificate must be created before the procedure can be closed.");
    }
  }

  static void validateForPdfGeneration(
      ProstituteProtectionProcedure procedure,
      DecryptedPersonalDataDto personalData,
      boolean withAlias,
      boolean withRegistrationCertificate) {
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> map =
        validateCompleteness(procedure, personalData, withAlias, withRegistrationCertificate);
    if (!map.isEmpty()) {
      throw new BadRequestException(
          "Procedure %s is not complete.".formatted(procedure.getExternalId()));
    }
  }

  public static void validateAlias(String alias, AppointmentBookingTypeDto appointmentBookingType) {
    if ((AppointmentBookingTypeDto.USER_DEFINED.equals(appointmentBookingType)
            || AppointmentBookingTypeDto.APPOINTMENT_BLOCK.equals(appointmentBookingType))
        && alias == null) {
      throw new BadRequestException(
          "An alias must be provided with appointment booking type %s"
              .formatted(appointmentBookingType));
    }
  }

  public static void validateEncryptedData(
      ProstituteProtectionProcedure procedure, EncryptedPersonalDataDto requestedEncryptedData) {
    EncryptedPersonalData persistedEncryptedPersonalData = procedure.getEncryptedPersonalData();
    if (persistedEncryptedPersonalData == null) {
      return;
    }

    if (procedure.getConsultationCertificateCreatedAt() != null
        && !Arrays.equals(
            persistedEncryptedPersonalData.getHashedPersonIdentifier(),
            requestedEncryptedData.hashedPersonIdentifier())) {
      throw new BadRequestException(
          "Personal data cannot be updated after a certificate was created.");
    }
  }

  public static void validateAppointmentData(
      AppointmentBookingTypeDto appointmentBookingTypeDto, UUID consultantId) {
    if (appointmentBookingTypeDto == AppointmentBookingTypeDto.APPOINTMENT_BLOCK
        && consultantId != null) {
      throw new BadRequestException(
          "A consultant cannot be assigned to the procedure if the appointment is from an appointment block.");
    }

    if ((appointmentBookingTypeDto == AppointmentBookingTypeDto.USER_DEFINED
            || appointmentBookingTypeDto == AppointmentBookingTypeDto.SPONTANEOUS)
        && consultantId == null) {
      throw new BadRequestException(
          "A consultant must be assigned to the procedure if the appointment is user defined.");
    }
  }
}

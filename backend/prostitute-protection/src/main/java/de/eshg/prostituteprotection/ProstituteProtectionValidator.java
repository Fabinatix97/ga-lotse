/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection;

import de.eshg.lib.procedure.util.ProcedureValidator;
import de.eshg.prostituteprotection.api.ProcedureProperty;
import de.eshg.prostituteprotection.api.RequiredProcedureArea;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.rest.service.error.BadRequestException;
import io.micrometer.common.util.StringUtils;
import java.util.EnumSet;
import java.util.LinkedHashMap;
import java.util.Map;

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

  public static Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> validateCompleteness(
      ProstituteProtectionProcedure procedure, boolean withAlias) {
    LinkedHashMap<RequiredProcedureArea, EnumSet<ProcedureProperty>> errors = new LinkedHashMap<>();

    putIfNotEmpty(errors, validateDetails(procedure, withAlias), RequiredProcedureArea.DETAILS);
    putIfNotEmpty(errors, validateConsultation(procedure), RequiredProcedureArea.CONSULTATION);

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
      ProstituteProtectionProcedure procedure, boolean withAlias) {
    EnumSet<ProcedureProperty> properties = EnumSet.noneOf(ProcedureProperty.class);

    // TODO: Decrypt first-name, last-name, date-of-birth from EncryptedPersonalData and check
    // properties
    if (withAlias) {
      addPropertyIfNull(
          properties, ProcedureProperty.ALIAS, procedure.getPersonalData().getAlias());
    }
    addPropertyIfNull(
        properties, ProcedureProperty.NATIONALITY, procedure.getPersonalData().getNationality());
    addPropertyIfNull(
        properties, ProcedureProperty.DOCUMENT_TYPE, procedure.getPersonalData().getDocumentType());

    return properties;
  }

  private static EnumSet<ProcedureProperty> validateConsultation(
      ProstituteProtectionProcedure procedure) {
    EnumSet<ProcedureProperty> properties = EnumSet.noneOf(ProcedureProperty.class);

    Consultation consultation = procedure.getConsultation();
    if (consultation == null) {
      throw new IllegalStateException(
          "Consultation for procedure %s should not be null".formatted(procedure.getExternalId()));
    } else {
      addPropertyIfFalse(
          properties, ProcedureProperty.LEGAL_ADVICES, consultation.isLegalAdvices());
      addPropertyIfFalse(
          properties,
          ProcedureProperty.HEALTH_AND_SOCIAL_INSURANCE,
          consultation.isHealthAndSocialInsurance());
      addPropertyIfFalse(
          properties, ProcedureProperty.CONSULTING_SERVICES, consultation.isConsultingServices());
      addPropertyIfFalse(
          properties, ProcedureProperty.EMERGENCY_HELP, consultation.isEmergencyHelp());
      addPropertyIfFalse(
          properties, ProcedureProperty.TAX_LIABILITY, consultation.isTaxLiability());
      addPropertyIfFalse(
          properties, ProcedureProperty.DISEASE_PREVENTION, consultation.isDiseasePrevention());
      addPropertyIfFalse(
          properties, ProcedureProperty.BIRTH_CONTROL, consultation.isBirthControl());
      addPropertyIfFalse(properties, ProcedureProperty.PREGNANCY, consultation.isPregnancy());
      addPropertyIfFalse(
          properties,
          ProcedureProperty.ALCOHOL_AND_DURG_USAGE,
          consultation.isAlcoholAndDrugUsage());
    }
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

  static void validateForPdfGeneration(ProstituteProtectionProcedure procedure, boolean withAlias) {
    ProcedureValidator.validateProcedureStatusNotClosed(procedure);
    Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> map =
        validateCompleteness(procedure, withAlias);
    if (!map.isEmpty()) {
      throw new BadRequestException(
          "Procedure %s is not complete.".formatted(procedure.getExternalId()));
    }
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.statistic;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.PersonalData;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure_;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import de.eshg.prostituteprotection.statistic.model.DocumentType;
import de.eshg.prostituteprotection.statistic.model.Language;
import de.eshg.prostituteprotection.statistic.model.ProcedureType;
import jakarta.persistence.criteria.Predicate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class ProstituteProtectionDataSource
    extends ProcedureDataSource<ProstituteProtectionProcedure, ProstituteProtectionAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("39370017-f0a7-4121-b8f4-9ebf31fb9312");

  public static final String DATA_SOURCE_NAME = "Vorgänge";
  static final DateTimeFormatter DATE_FORMAT =
      DateTimeFormatter.ofPattern("MM.yyyy", Locale.GERMANY);

  public ProstituteProtectionDataSource(ProstituteProtectionProcedureRepository repository) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        null,
        repository,
        ProstituteProtectionAttributes.values());
  }

  @Override
  protected Specification<ProstituteProtectionProcedure> getProcedureSpecification(
      TimeRange timeRange) {
    return (root, query, criteriaBuilder) -> {
      Predicate appointmentStartInTimeRange =
          isInTimeRange(
              criteriaBuilder,
              root.get(ProstituteProtectionProcedure_.appointmentStart),
              timeRange);

      Predicate isClosed =
          criteriaBuilder.equal(root.get(Procedure_.procedureStatus), ProcedureStatus.CLOSED);

      return criteriaBuilder.and(appointmentStartInTimeRange, isClosed);
    };
  }

  @Override
  protected Object mapSpecificValue(
      ProstituteProtectionProcedure procedure,
      ProstituteProtectionAttributes attribute,
      TimeRange timeRange) {
    PersonalData personalData = procedure.getPersonalData();

    return switch (attribute) {
      case PROCEDURE_ID -> procedure.getExternalId();
      case PROCEDURE_TYPE -> getProcedureType(procedure);
      case AGE -> procedure.getAgeAtConsultation();
      case ALIAS -> Boolean.TRUE.equals(procedure.getCertificateWithAliasCreated());
      case DOCUMENT_TYPE -> getDocumentType(personalData);
      case CONSULTATION_DATE -> getConsultationDate(procedure);
      case CONSULTATION_LANGUAGE -> getLanguageOfConsultation(procedure.getConsultation());
      case INFORMATION_MATERIAL ->
          getConsultationAttribute(procedure, Consultation::isInformationMaterial);
      case CLEARING -> getConsultationAttribute(procedure, Consultation::isClearing);
      case REFERRAL -> getConsultationAttribute(procedure, Consultation::isReferral);
      case PREDICAMENT -> getConsultationAttribute(procedure, Consultation::isPredicament);
      case INTERPRETER -> getConsultationAttribute(procedure, Consultation::isInterpreterConsulted);
      case GERMAN -> getGermanLanguage(procedure.getConsultation());
    };
  }

  private Boolean getGermanLanguage(Consultation consultation) {
    if (consultation == null) {
      return null;
    }
    return de.eshg.prostituteprotection.domain.model.Language.GERMAN.equals(
        consultation.getLanguageOfConsultation());
  }

  private String getProcedureType(ProstituteProtectionProcedure procedure) {
    return ProcedureType.convertProcedureTypeToValue(procedure.getProcedureType());
  }

  private String getLanguageOfConsultation(Consultation consultation) {
    if (consultation == null) {
      return null;
    }
    return Language.convertFamilyLanguageToValue(consultation.getLanguageOfConsultation());
  }

  private String getConsultationDate(ProstituteProtectionProcedure procedure) {
    if (procedure.getAppointmentStart() == null) {
      return null;
    }
    return procedure.getAppointmentStart().atZone(ZoneId.systemDefault()).format(DATE_FORMAT);
  }

  private String getDocumentType(PersonalData personalData) {
    if (personalData == null) {
      return null;
    }
    return DocumentType.convertDocumentTypeToValue(personalData.getDocumentType());
  }

  private boolean getConsultationAttribute(
      ProstituteProtectionProcedure procedure, Function<Consultation, Boolean> getter) {
    if (procedure.getConsultation() == null) {
      return false;
    }
    return getter.apply(procedure.getConsultation());
  }
}

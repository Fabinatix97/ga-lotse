/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment_;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.DateRange;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.schoolentry.domain.model.DevelopmentScreening_;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure_;
import de.eshg.schoolentry.domain.model.SchoolFeedback;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import de.eshg.schoolentry.statistics.attributes.EsuAnamnesisAttributes;
import de.eshg.schoolentry.statistics.attributes.EsuAttributes;
import de.eshg.schoolentry.statistics.attributes.EsuChildAttributes;
import de.eshg.schoolentry.statistics.attributes.EsuDevelopmentScreeningAttribute;
import de.eshg.schoolentry.statistics.attributes.EsuProcedureAttribute;
import de.eshg.schoolentry.statistics.attributes.EsuSopessAttribute;
import de.eshg.schoolentry.statistics.attributes.EsuVaccinationAttribute;
import de.eshg.schoolentry.statistics.attributes.EsuVisionHearingAttribute;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class SchoolEntryProcedureDataSource
    extends ProcedureDataSource<SchoolEntryProcedure, EsuAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("5bee6747-9cbc-423c-a192-ad978d45970c");
  private static final String DATA_SOURCE_NAME = "ESU";

  static final DateTimeFormatter DATE_FORMAT =
      DateTimeFormatter.ofPattern("MM.yyyy", Locale.GERMANY);

  private final AnamnesisStatistics anamnesisStatistics;
  private final Clock clock;

  public SchoolEntryProcedureDataSource(
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      AnamnesisStatistics anamnesisStatistics,
      Clock clock) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.SENSITIVE,
        5,
        schoolEntryProcedureRepository,
        EsuAttributes.allAttributes());
    this.anamnesisStatistics = anamnesisStatistics;
    this.clock = clock;
  }

  @Override
  protected Specification<SchoolEntryProcedure> getProcedureSpecification(TimeRange timeRange) {
    return (root, query, criteriaBuilder) -> {
      Path<LocalDate> examinationDatePath = root.get(SchoolEntryProcedure_.examinationDate);

      Predicate examinationDateInTimeRange =
          isInTimeRangeIfPresent(criteriaBuilder, examinationDatePath, toDateRange(timeRange));

      Path<Instant> appointmentStartPath =
          root.join(SchoolEntryProcedure_.appointment, JoinType.LEFT)
              .get(Appointment_.appointmentStart);

      Predicate appointmentStartInTimeRange =
          isInTimeRangeIfPresent(criteriaBuilder, appointmentStartPath, timeRange);

      // Paranoia check - this should be true for all closed procedures
      Predicate examinationDateOrAppointmentStartNotNull =
          criteriaBuilder.or(
              criteriaBuilder.isNotNull(examinationDatePath),
              criteriaBuilder.isNotNull(appointmentStartPath));

      Predicate isClosed =
          criteriaBuilder.equal(root.get(Procedure_.procedureStatus), ProcedureStatus.CLOSED);

      Predicate isCanChild =
          criteriaBuilder.equal(root.get(Procedure_.procedureType), ProcedureType.CAN_CHILD);

      Path<SchoolFeedback> schoolFeedbackPath =
          root.join(SchoolEntryProcedure_.developmentScreeningResult)
              .get(DevelopmentScreening_.schoolFeedback);

      Predicate hasNegativeFeedback =
          criteriaBuilder.and(
              criteriaBuilder.isNotNull(schoolFeedbackPath),
              criteriaBuilder.equal(schoolFeedbackPath, SchoolFeedback.NEGATIVE));

      Predicate isNotCanChildWithNegativeFeedback =
          criteriaBuilder.not(criteriaBuilder.and(isCanChild, hasNegativeFeedback));

      return criteriaBuilder.and(
          examinationDateInTimeRange,
          appointmentStartInTimeRange,
          examinationDateOrAppointmentStartNotNull,
          isClosed,
          isNotCanChildWithNegativeFeedback);
    };
  }

  private DateRange toDateRange(TimeRange timeRange) {
    return new DateRange(toLocalDate(timeRange.start()), toLocalDate(timeRange.end()));
  }

  private LocalDate toLocalDate(Instant instant) {
    return instant.atZone(clock.getZone()).toLocalDate();
  }

  @Override
  protected Object mapSpecificValue(
      SchoolEntryProcedure procedure, EsuAttributes attribute, TimeRange timeRange) {
    return switch (attribute) {
      case EsuAnamnesisAttributes anamnesisAttribute ->
          anamnesisStatistics.mapAnamnesisAttribute(procedure, anamnesisAttribute);
      case EsuChildAttributes childAttribute -> mapChildAttribute(procedure, childAttribute);
      case EsuProcedureAttribute procedureAttribute ->
          mapProcedureAttribute(procedure, procedureAttribute);
      case EsuSopessAttribute sopessAttribute ->
          SopessStatistics.mapAttribute(procedure, sopessAttribute);
      case EsuDevelopmentScreeningAttribute developmentScreeningAttribute ->
          DevelopmentScreeningStatistics.mapAttribute(procedure, developmentScreeningAttribute);
      case EsuVaccinationAttribute vaccinationAttribute ->
          VaccinationStatistics.mapAttribute(procedure, vaccinationAttribute);
      case EsuVisionHearingAttribute visionHearingAttribute ->
          VisionHearingStatistics.mapVisionHearingAttribute(procedure, visionHearingAttribute);
    };
  }

  private Object mapProcedureAttribute(
      SchoolEntryProcedure procedure, EsuProcedureAttribute esuProcedureAttributes) {
    return switch (esuProcedureAttributes) {
      case UNTERSDAT -> getAppointmentOrExaminationDate(procedure);
    };
  }

  private static Object mapChildAttribute(
      SchoolEntryProcedure procedure, EsuChildAttributes attribute) {
    return switch (attribute) {
      case PROCEDURE_ID -> procedure.getExternalId();
      case CHILD_CENTRAL_FILE_ID -> procedure.getChildIdFromCentralFile();
      case KIH -> AnamnesisStatistics.getNumberOfSiblings(procedure);
      case SCHULE -> procedure.getSchoolId();
      case SCHULJAHR -> getSchoolYear(procedure);
    };
  }

  private static String getSchoolYear(SchoolEntryProcedure procedure) {
    if (procedure.getSchoolYear() == null) {
      return null;
    }

    DateTimeFormatter yearPattern = DateTimeFormatter.ofPattern("yy");
    return String.format(
        "%s/%s",
        procedure.getSchoolYear().format(yearPattern),
        procedure.getSchoolYear().plusYears(1).format(yearPattern));
  }

  private String getAppointmentOrExaminationDate(SchoolEntryProcedure procedure) {
    if (procedure == null
        || (procedure.getAppointment() == null && procedure.getExaminationDate() == null)) {
      return null;
    }
    if (procedure.getExaminationDate() != null) {
      return procedure.getExaminationDate().format(DATE_FORMAT);
    } else {
      return procedure
          .getAppointment()
          .getAppointmentStart()
          .atZone(clock.getZone())
          .format(DATE_FORMAT);
    }
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.statistic;

import static de.eshg.dental.statistic.StatisticsCalculationHelper.calculateDmftValue;

import de.eshg.dental.domain.model.*;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.statistic.model.*;
import de.eshg.dental.statistic.model.DecayStatus;
import de.eshg.dental.statistic.model.MihStatus;
import de.eshg.dental.statistic.model.OralHygieneStatus;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Predicate;
import java.util.function.ToIntFunction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class DentalChildDataSource extends ProcedureDataSource<Child, DentalChildAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("b5369dfc-d9d4-42e9-abc7-428c6ad348ca");

  public static final String DATA_SOURCE_NAME = "ZAD Kind";

  static final DateTimeFormatter DATE_FORMAT =
      DateTimeFormatter.ofPattern("MM.yyyy", Locale.GERMANY);

  private final Clock clock;

  public DentalChildDataSource(ChildRepository childRepository, Clock clock) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        null,
        childRepository,
        DentalChildAttributes.values());
    this.clock = clock;
  }

  @Override
  protected Specification<Child> getProcedureSpecification(TimeRange timeRange) {
    return (root, query, criteriaBuilder) -> {
      Subquery<Long> subquery = query.subquery(Long.class);
      Root<Examination> examinationRoot = subquery.from(Examination.class);

      Path<Instant> dateTimePath =
          examinationRoot.get(Examination_.prophylaxisSession).get(ProphylaxisSession_.dateAndTime);

      subquery
          .select(criteriaBuilder.literal(1L))
          .where(
              criteriaBuilder.equal(examinationRoot.get(Examination_.child), root),
              criteriaBuilder.greaterThanOrEqualTo(dateTimePath, timeRange.start()),
              criteriaBuilder.lessThanOrEqualTo(dateTimePath, timeRange.end()));

      return criteriaBuilder.and(
          isIncluded(root, criteriaBuilder), criteriaBuilder.exists(subquery));
    };
  }

  @Override
  protected Object mapSpecificValue(
      Child child, DentalChildAttributes attribute, TimeRange timeRange) {
    Optional<ScreeningExaminationResult> latestScreeningExamination =
        getLatestScreeningExaminationResult(child.getExaminations(), timeRange);

    return switch (attribute) {
      case PROCEDURE_ID -> child.getExternalId();
      case UNTERSUCHUNGSDATUM ->
          getLatestExaminationDate(child.getExaminations(), timeRange).orElse(null);
      case CHILD_CENTRAL_FILE_ID -> child.getChildIdFromCentralFile();
      case CHILD_AGE -> latestScreeningExamination.map(this::getChildAgeAtExamination).orElse(null);
      case SCHULJAHR -> getSchoolYear(child);
      case EINRICHTUNG -> child.getInstitutionId();
      case GRUPPE -> getGroup(child.getGroupName());
      case ANZAHL_MASSNAHMEN -> child.getExaminations().size();
      case MUNDHYGIENE_STATUS ->
          latestScreeningExamination.map(this::getOralHygieneStatus).orElse(null);
      case MIH_STATUS -> latestScreeningExamination.map(this::getMihStatus).orElse(null);
      case DMFT_MILCH ->
          latestScreeningExamination.map(this::calculateDmftPrimaryTeethValue).orElse(null);
      case DMFT_BLEIBEND ->
          latestScreeningExamination.map(this::calculateDmftSecondaryTeethValue).orElse(null);
      case KARIES_HOCH_RISIKO -> latestScreeningExamination.map(this::getDecayRisk).orElse(null);
      case KARIES_STATUS -> latestScreeningExamination.map(this::getDecayStatus).orElse(null);
      case SANIERUNGSGRAD_MILCH ->
          getDegreeOfRestoration(latestScreeningExamination, Tooth::isPrimaryTooth);
      case SANIERUNGSGRAD_BLEIBEND ->
          getDegreeOfRestoration(latestScreeningExamination, Tooth::isSecondaryTooth);
      case HYPOPLASIE_MILCH -> getHSum(latestScreeningExamination, Tooth::isPrimaryTooth);
      case HYPOPLASIE_BLEIBEND -> getHSum(latestScreeningExamination, Tooth::isSecondaryTooth);
      case INITIALKARIES_MILCH -> getISum(latestScreeningExamination, Tooth::isPrimaryTooth);
      case INITIALKARIES_BLEIBEND -> getISum(latestScreeningExamination, Tooth::isSecondaryTooth);
      case D_WERTE_MILCH ->
          getDValues(latestScreeningExamination, Tooth::isPrimaryTooth, DMFValues::getDValue);
      case D_WERTE_BLEIBEND ->
          getDValues(latestScreeningExamination, Tooth::isSecondaryTooth, DMFValues::getDValue);
      case M_WERTE_MILCH ->
          getDValues(latestScreeningExamination, Tooth::isPrimaryTooth, DMFValues::getMValue);
      case M_WERTE_BLEIBEND ->
          getDValues(latestScreeningExamination, Tooth::isSecondaryTooth, DMFValues::getMValue);
      case F_WERTE_MILCH ->
          getDValues(latestScreeningExamination, Tooth::isPrimaryTooth, DMFValues::getFValue);
      case F_WERTE_BLEIBEND ->
          getDValues(latestScreeningExamination, Tooth::isSecondaryTooth, DMFValues::getFValue);
    };
  }

  private String getSchoolYear(Child child) {
    if (child.getYear() == null) {
      return null;
    }

    DateTimeFormatter yearPattern = DateTimeFormatter.ofPattern("yy");
    return String.format(
        "%s/%s",
        child.getYear().format(yearPattern), child.getYear().plusYears(1).format(yearPattern));
  }

  private Integer getChildAgeAtExamination(ScreeningExaminationResult latestScreeningExamination) {
    return latestScreeningExamination.getChildAge();
  }

  private Integer getDValues(
      Optional<ScreeningExaminationResult> latestScreeningExamination,
      Predicate<Tooth> expectedToothType,
      ToIntFunction<DMFValues> getter) {
    return latestScreeningExamination
        .map(
            result ->
                getter.applyAsInt(
                    StatisticsCalculationHelper.calculateDMFValues(
                        result.getToothDiagnoses(), expectedToothType)))
        .orElse(null);
  }

  private Long getHSum(
      Optional<ScreeningExaminationResult> latestScreeningExamination,
      Predicate<Tooth> expectedToothType) {

    return latestScreeningExamination
        .map(
            result ->
                result.getToothDiagnoses().entrySet().stream()
                    .filter(
                        toothDiagnosis ->
                            (expectedToothType.test(toothDiagnosis.getKey())
                                    || toothDiagnosis.getKey().isWisdomTooth())
                                && (toothDiagnosis.getValue().mainResult() == MainResult.H
                                    || toothDiagnosis.getValue().secondaryResult()
                                        == SecondaryResult.H))
                    .count())
        .orElse(null);
  }

  private Long getISum(
      Optional<ScreeningExaminationResult> latestScreeningExamination,
      Predicate<Tooth> expectedToothType) {

    return latestScreeningExamination
        .map(
            result ->
                result.getToothDiagnoses().entrySet().stream()
                    .filter(
                        toothDiagnosis ->
                            (expectedToothType.test(toothDiagnosis.getKey())
                                    || toothDiagnosis.getKey().isWisdomTooth())
                                && (toothDiagnosis.getValue().mainResult() == MainResult.I
                                    || toothDiagnosis.getValue().secondaryResult()
                                        == SecondaryResult.I))
                    .count())
        .orElse(null);
  }

  private Double getDegreeOfRestoration(
      Optional<ScreeningExaminationResult> latestScreeningExamination,
      Predicate<Tooth> expectedToothType) {
    return latestScreeningExamination
        .map(
            result ->
                StatisticsCalculationHelper.calculateDMFValues(
                        result.getToothDiagnoses(), expectedToothType)
                    .getDegreeOfRestoration())
        .orElse(null);
  }

  private Object getMihStatus(ScreeningExaminationResult latestScreeningExamination) {
    return MihStatus.convertMihStatusToValue(latestScreeningExamination.getMihStatus());
  }

  private String getOralHygieneStatus(ScreeningExaminationResult latestScreeningExamination) {
    return OralHygieneStatus.convertOralHygieneStatusToValue(
        latestScreeningExamination.getOralHygieneStatus());
  }

  private Optional<String> getLatestExaminationDate(
      List<Examination> examinations, TimeRange timeRange) {
    return examinations.stream()
        .filter(examination -> isBeforeEndOfTimeRange(examination.getDateAndTime(), timeRange))
        .max(Comparator.comparing(Examination::getDateAndTime))
        .map(Examination::getDateAndTime)
        .map(instant -> instant.atZone(clock.getZone()).format(DATE_FORMAT));
  }

  private Optional<ScreeningExaminationResult> getLatestScreeningExaminationResult(
      List<Examination> examinations, TimeRange timeRange) {
    return examinations.stream()
        .filter(examination -> examination.getResult() instanceof ScreeningExaminationResult)
        .filter(examination -> isBeforeEndOfTimeRange(examination.getDateAndTime(), timeRange))
        .max(Comparator.comparing(Examination::getDateAndTime))
        .map(Examination::getResult)
        .map(ScreeningExaminationResult.class::cast);
  }

  private boolean isBeforeEndOfTimeRange(Instant dateTime, TimeRange timeRange) {
    return dateTime.isBefore(timeRange.end());
  }

  private Long calculateDmftPrimaryTeethValue(
      ScreeningExaminationResult latestScreeningExamination) {
    return calculateDmftTeethValue(latestScreeningExamination, Tooth::isPrimaryTooth);
  }

  private Long calculateDmftSecondaryTeethValue(
      ScreeningExaminationResult latestScreeningExamination) {
    return calculateDmftTeethValue(latestScreeningExamination, Tooth::isSecondaryTooth);
  }

  private Long calculateDmftTeethValue(
      ScreeningExaminationResult latestScreeningExamination, Predicate<Tooth> expectedToothType) {
    return calculateDmftValue(expectedToothType, latestScreeningExamination.getToothDiagnoses());
  }

  private Boolean getDecayRisk(ScreeningExaminationResult latestScreeningExamination) {
    return latestScreeningExamination.getDecayRisk();
  }

  private String getDecayStatus(ScreeningExaminationResult latestScreeningExamination) {
    return DecayStatus.convertDecayStatusToValue(latestScreeningExamination.getDecayStatus());
  }

  private String getGroup(String groupName) {
    if (groupName == null) {
      return null;
    }
    return Group.convertToGroupValue(groupName).getValue();
  }
}

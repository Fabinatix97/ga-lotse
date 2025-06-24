/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.function.ToIntFunction;
import org.springframework.stereotype.Component;

@Component
public class DentalChildDataSource extends ProcedureDataSource<Child, DentalChildAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("b5369dfc-d9d4-42e9-abc7-428c6ad348ca");

  public static final String DATA_SOURCE_NAME = "ZAD Kind";

  public DentalChildDataSource(ChildRepository childRepository) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.SENSITIVE,
        null,
        childRepository,
        DentalChildAttributes.values());
  }

  @Override
  protected Object mapSpecificValue(
      Child child, DentalChildAttributes attribute, TimeRange timeRange) {
    Optional<ScreeningExaminationResult> latestScreeningExamination =
        getLatestScreeningExaminationResult(child.getExaminations());

    return switch (attribute) {
      case PROCEDURE_ID -> child.getExternalId();
      case CHILD_CENTRAL_FILE_ID -> child.getChildIdFromCentralFile();
      case EINRICHTUNG -> child.getInstitutionId();
      case GRUPPE -> getGroup(child.getGroupName());
      case ANZAHL_PROPHYLAXEN -> child.getExaminations().size();
      case MUNDHYGIENE_STATUS ->
          latestScreeningExamination.map(this::getOralHygieneStatus).orElse(null);
      case MIH_STATUS -> latestScreeningExamination.map(this::getMihStatus).orElse(null);
      case DMFT_MILCH ->
          latestScreeningExamination.map(this::calculateDmftPrimaryTeethValue).orElse(null);
      case DMFT_BLEIBEND ->
          latestScreeningExamination.map(this::calculateDmftSecondaryTeethValue).orElse(null);
      case KARIES_RISIKO -> latestScreeningExamination.map(this::getDecayRisk).orElse(null);
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

  private Optional<ScreeningExaminationResult> getLatestScreeningExaminationResult(
      List<Examination> examinations) {
    return examinations.stream()
        .filter(examination -> examination.getResult() instanceof ScreeningExaminationResult)
        .max(Comparator.comparing(Examination::getDateAndTime))
        .map(Examination::getResult)
        .map(ScreeningExaminationResult.class::cast);
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

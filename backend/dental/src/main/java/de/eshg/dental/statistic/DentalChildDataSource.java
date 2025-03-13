/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import static de.eshg.dental.statistic.StatisticsCalculationHelper.calculateDmftValue;

import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ScreeningExaminationResult;
import de.eshg.dental.domain.model.Tooth;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.statistic.model.DecayStatus;
import de.eshg.dental.statistic.model.Group;
import de.eshg.dental.statistic.model.MihStatus;
import de.eshg.dental.statistic.model.OralHygieneStatus;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import java.time.LocalDate;
import java.time.Year;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.function.Predicate;
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
        childRepository,
        DentalChildAttributes.values());
  }

  @Override
  protected Object mapSpecificValue(
      Child child, DentalChildAttributes attribute, TimeRange timeRange) {
    return switch (attribute) {
      case PROCEDURE_ID -> child.getExternalId();
      case CHILD_CENTRAL_FILE_ID -> child.getChildIdFromCentralFile();
      case EINRICHTUNG -> child.getInstitutionId();
      case GRUPPE -> getGroup(child.getGroupName());
      case ANZAHL_PROPHYLAXEN -> child.getExaminations().size();
      case MUNDHYGIENE_STATUS -> getOralHygieneStatus(child.getExaminations(), child.getYear());
      case MIH_STATUS -> getMihStatus(child.getExaminations(), child.getYear());
      case DMFT_MILCH -> calculateDmftPrimaryTeethValue(child.getExaminations(), child.getYear());
      case DMFT_BLEIBEND ->
          calculateDmftSecondaryTeethValue(child.getExaminations(), child.getYear());
      case KARIES_RISIKO -> getDecayRisk(child.getExaminations(), child.getYear());
      case KARIES_STATUS -> getDecayStatus(child.getExaminations(), child.getYear());
    };
  }

  private Object getMihStatus(List<Examination> examinations, Year year) {
    ScreeningExaminationResult latestScreeningExamination =
        getLatestScreeningExaminationResultOrNull(examinations, year);
    if (latestScreeningExamination == null) {
      return null;
    }
    return MihStatus.convertMihStatusToValue(latestScreeningExamination.getMihStatus());
  }

  private String getOralHygieneStatus(List<Examination> examinations, Year year) {
    ScreeningExaminationResult latestScreeningExamination =
        getLatestScreeningExaminationResultOrNull(examinations, year);
    if (latestScreeningExamination == null) {
      return null;
    }
    return OralHygieneStatus.convertOralHygieneStatusToValue(
        latestScreeningExamination.getOralHygieneStatus());
  }

  private ScreeningExaminationResult getLatestScreeningExaminationResultOrNull(
      List<Examination> examinations, Year year) {
    return examinations.stream()
        .filter(
            examination ->
                LocalDate.ofInstant(examination.getDateAndTime(), ZoneOffset.UTC).getYear()
                    == year.getValue())
        .filter(examination -> examination.getResult() instanceof ScreeningExaminationResult)
        .max(Comparator.comparing(Examination::getDateAndTime))
        .map(Examination::getResult)
        .map(ScreeningExaminationResult.class::cast)
        .orElse(null);
  }

  private Long calculateDmftPrimaryTeethValue(List<Examination> examinations, Year year) {
    return calculateDmftTeethValue(examinations, year, Tooth::isPrimaryTooth);
  }

  private Long calculateDmftSecondaryTeethValue(List<Examination> examinations, Year year) {
    return calculateDmftTeethValue(examinations, year, Tooth::isSecondaryTooth);
  }

  private Long calculateDmftTeethValue(
      List<Examination> examinations, Year year, Predicate<Tooth> expectedToothType) {
    ScreeningExaminationResult latestScreeningExamination =
        getLatestScreeningExaminationResultOrNull(examinations, year);
    if (latestScreeningExamination == null) {
      return null;
    }

    return calculateDmftValue(expectedToothType, latestScreeningExamination.getToothDiagnoses());
  }

  private Boolean getDecayRisk(List<Examination> examinations, Year year) {
    ScreeningExaminationResult latestScreeningExamination =
        getLatestScreeningExaminationResultOrNull(examinations, year);
    if (latestScreeningExamination == null) {
      return null;
    }
    return latestScreeningExamination.getDecayRisk();
  }

  private String getDecayStatus(List<Examination> examinations, Year year) {
    ScreeningExaminationResult latestScreeningExamination =
        getLatestScreeningExaminationResultOrNull(examinations, year);
    if (latestScreeningExamination == null) {
      return null;
    }
    return DecayStatus.convertDecayStatusToValue(latestScreeningExamination.getDecayStatus());
  }

  private String getGroup(String groupName) {
    if (groupName == null) {
      return null;
    }
    return Group.convertToGroupValue(groupName).getValue();
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import de.eshg.dental.domain.model.DecayStatus;
import de.eshg.dental.domain.model.DentitionType;
import de.eshg.dental.domain.model.MainResult;
import de.eshg.dental.domain.model.Tooth;
import de.eshg.dental.domain.model.ToothDiagnosis;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Predicate;

public class StatisticsCalculationHelper {
  private StatisticsCalculationHelper() {}

  public static long calculateDmftValue(
      Predicate<Tooth> expectedToothType, Map<Tooth, ToothDiagnosis> toothDiagnoses) {
    return calculateDiagnosisValue(
        expectedToothType,
        toothDiagnoses,
        diagnosis ->
            List.of(MainResult.D, MainResult.E, MainResult.F).contains(diagnosis.mainResult()));
  }

  private static long calculateMainResultValue(
      Predicate<Tooth> expectedToothType,
      Map<Tooth, ToothDiagnosis> toothDiagnoses,
      MainResult mainResult) {
    return calculateDiagnosisValue(
        expectedToothType, toothDiagnoses, diagnosis -> diagnosis.mainResult() == mainResult);
  }

  private static long calculateDiagnosisValue(
      Predicate<Tooth> expectedToothType,
      Map<Tooth, ToothDiagnosis> toothDiagnoses,
      Predicate<ToothDiagnosis> diagnosisPredicate) {

    return toothDiagnoses.entrySet().stream()
        .filter(entry -> expectedToothType.test(entry.getKey()))
        .map(Map.Entry::getValue)
        .filter(Objects::nonNull)
        .filter(value -> value.mainResult() != null)
        .filter(diagnosisPredicate)
        .count();
  }

  public static Optional<Boolean> calculateDecayRisk(
      Map<Tooth, ToothDiagnosis> toothDiagnoses, int ageOfChild) {
    if (toothDiagnoses == null || ageOfChild > 9) {
      return Optional.empty();
    }

    long primaryDmftValue = calculateDmftValue(Tooth::isPrimaryTooth, toothDiagnoses);
    long secondaryDmftValue = calculateDmftValue(Tooth::isSecondaryTooth, toothDiagnoses);
    long secondaryDValue = calculateSecondaryTeethValueForMainResult(toothDiagnoses, MainResult.D);

    boolean decayRisk =
        switch (ageOfChild) {
          case 0, 1, 2, 3 -> primaryDmftValue > 0;
          case 4 -> primaryDmftValue > 2;
          case 5 -> primaryDmftValue > 4;
          case 6, 7 -> primaryDmftValue + secondaryDmftValue > 5 || secondaryDValue > 0;
          case 8, 9 -> primaryDmftValue + secondaryDmftValue > 5 || secondaryDValue > 2;
          default -> false;
        };
    return Optional.of(decayRisk);
  }

  public static DecayStatus calculateDecayStatus(Map<Tooth, ToothDiagnosis> toothDiagnoses) {

    if (toothDiagnoses == null) {
      return null;
    }

    Long primaryDValue =
        getDecayValueForDentitionType(toothDiagnoses, DentitionType.PRIMARY, MainResult.D);
    Long secondaryDValue =
        getDecayValueForDentitionType(toothDiagnoses, DentitionType.SECONDARY, MainResult.D);
    Long primaryMValue =
        getDecayValueForDentitionType(toothDiagnoses, DentitionType.PRIMARY, MainResult.E);
    Long secondaryMValue =
        getDecayValueForDentitionType(toothDiagnoses, DentitionType.SECONDARY, MainResult.E);
    Long primaryFValue =
        getDecayValueForDentitionType(toothDiagnoses, DentitionType.PRIMARY, MainResult.F);
    Long secondaryFValue =
        getDecayValueForDentitionType(toothDiagnoses, DentitionType.SECONDARY, MainResult.F);

    if (primaryDValue + secondaryDValue > 0) {
      return DecayStatus.TREATMENT_REQUIRED;
    }
    if (primaryDValue + secondaryDValue == 0
        && (primaryMValue + primaryFValue + secondaryMValue + secondaryFValue) > 0) {
      return DecayStatus.RESTORED;
    }
    return DecayStatus.HEALTHY;
  }

  private static Long getDecayValueForDentitionType(
      Map<Tooth, ToothDiagnosis> toothDiagnoses,
      DentitionType dentitionType,
      MainResult mainResult) {
    if (dentitionType == DentitionType.PRIMARY) {
      return calculatePrimaryTeethValueForMainResult(toothDiagnoses, mainResult);
    } else if (dentitionType == DentitionType.SECONDARY) {
      return calculateSecondaryTeethValueForMainResult(toothDiagnoses, mainResult);
    }
    return 0L;
  }

  private static long calculatePrimaryTeethValueForMainResult(
      Map<Tooth, ToothDiagnosis> toothDiagnoses, MainResult mainResult) {
    return calculateMainResultTeethValue(toothDiagnoses, Tooth::isPrimaryTooth, mainResult);
  }

  private static long calculateSecondaryTeethValueForMainResult(
      Map<Tooth, ToothDiagnosis> toothDiagnoses, MainResult mainResult) {
    return calculateMainResultTeethValue(toothDiagnoses, Tooth::isSecondaryTooth, mainResult);
  }

  private static long calculateMainResultTeethValue(
      Map<Tooth, ToothDiagnosis> toothDiagnoses,
      Predicate<Tooth> expectedToothType,
      MainResult mainResult) {
    return calculateMainResultValue(expectedToothType, toothDiagnoses, mainResult);
  }
}

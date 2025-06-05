/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import de.eshg.dental.domain.model.DecayStatus;
import de.eshg.dental.domain.model.MainResult;
import de.eshg.dental.domain.model.SecondaryResult;
import de.eshg.dental.domain.model.Tooth;
import de.eshg.dental.domain.model.ToothDiagnosis;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Stream;

public class StatisticsCalculationHelper {
  private static final List<SecondaryResult> D_DIAGNOSES =
      List.of(SecondaryResult.D, SecondaryResult.E, SecondaryResult.W);
  private static final List<SecondaryResult> M_DIAGNOSES = List.of(SecondaryResult.M);
  private static final List<SecondaryResult> F_DIAGNOSES =
      List.of(SecondaryResult.F, SecondaryResult.K);

  private StatisticsCalculationHelper() {}

  public static long calculateDmftValue(
      Predicate<Tooth> expectedToothType, Map<Tooth, ToothDiagnosis> toothDiagnoses) {
    return calculateDMFValues(toothDiagnoses, expectedToothType).getDmftValue();
  }

  public static Optional<Boolean> calculateDecayRisk(
      Map<Tooth, ToothDiagnosis> toothDiagnoses, int ageOfChild) {
    if (toothDiagnoses == null || ageOfChild > 9) {
      return Optional.empty();
    }
    DMFValues primaryDmfValues = calculateDMFValues(toothDiagnoses, Tooth::isPrimaryTooth);
    DMFValues secondaryDmfValues = calculateDMFValues(toothDiagnoses, Tooth::isSecondaryTooth);

    long primaryDmftValue = primaryDmfValues.getDmftValue();
    long secondaryDmftValue = secondaryDmfValues.getDmftValue();
    long secondaryDValue = secondaryDmfValues.dValue;

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
    DMFValues primaryDmfValues = calculateDMFValues(toothDiagnoses, Tooth::isPrimaryTooth);
    DMFValues secondaryDmfValues = calculateDMFValues(toothDiagnoses, Tooth::isSecondaryTooth);

    int primaryDValue = primaryDmfValues.dValue;
    int secondaryDValue = secondaryDmfValues.dValue;

    int primaryMValue = primaryDmfValues.mValue;
    int secondaryMValue = secondaryDmfValues.mValue;

    int primaryFValue = primaryDmfValues.fValue;
    int secondaryFValue = secondaryDmfValues.fValue;

    if (primaryDValue + secondaryDValue > 0) {
      return DecayStatus.TREATMENT_REQUIRED;
    }
    if (primaryDValue + secondaryDValue == 0
        && (primaryMValue + primaryFValue + secondaryMValue + secondaryFValue) > 0) {
      return DecayStatus.RESTORED;
    }
    return DecayStatus.HEALTHY;
  }

  private static DMFValues calculateDMFValues(
      Map<Tooth, ToothDiagnosis> toothDiagnoses, Predicate<Tooth> expectedToothType) {
    List<List<SecondaryResult>> results =
        toothDiagnoses.entrySet().stream()
            .filter(entry -> expectedToothType.test(entry.getKey()))
            .map(Map.Entry::getValue)
            .filter(Objects::nonNull)
            .map(
                diagnoses ->
                    Stream.of(
                            toSecondaryResult(diagnoses.mainResult()), diagnoses.secondaryResult())
                        .filter(Objects::nonNull)
                        .toList())
            .toList();

    DMFValues dmfValues = new DMFValues();
    for (List<SecondaryResult> result : results) {
      if (result.stream().anyMatch(M_DIAGNOSES::contains)) {
        dmfValues.mValue++;
      } else if (result.stream().anyMatch(D_DIAGNOSES::contains)) {
        dmfValues.dValue++;
      } else if (result.stream().anyMatch(F_DIAGNOSES::contains)) {
        dmfValues.fValue++;
      }
    }
    return dmfValues;
  }

  private static class DMFValues {
    int dValue;
    int mValue;
    int fValue;

    public DMFValues() {
      this.dValue = 0;
      this.mValue = 0;
      this.fValue = 0;
    }

    int getDmftValue() {
      return dValue + fValue + mValue;
    }
  }

  private static SecondaryResult toSecondaryResult(MainResult mainResult) {
    return switch (mainResult) {
      case null -> null;
      case S -> SecondaryResult.S;
      case I -> SecondaryResult.I;
      case D -> SecondaryResult.D;
      case F -> SecondaryResult.F;
      case M -> SecondaryResult.M;
      case X -> SecondaryResult.X;
      case Z -> SecondaryResult.Z;
      case T -> SecondaryResult.T;
      case H -> SecondaryResult.H;
      case O -> SecondaryResult.O;
      case V -> SecondaryResult.V;
      case N -> SecondaryResult.N;
      case U -> SecondaryResult.U;
      case K -> SecondaryResult.K;
      case E -> SecondaryResult.E;
      case W -> SecondaryResult.W;
      case P -> SecondaryResult.P;
      case A -> SecondaryResult.A;
    };
  }
}

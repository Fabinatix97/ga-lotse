/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.statistic;

import de.eshg.dental.domain.model.DecayStatus;
import de.eshg.dental.domain.model.MainResult;
import de.eshg.dental.domain.model.SecondaryResult;
import de.eshg.dental.domain.model.Tooth;
import de.eshg.dental.domain.model.ToothDiagnosis;
import de.eshg.dental.statistic.model.DMFValues;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Stream;

public class StatisticsCalculationHelper {
  private static final List<SecondaryResult> D_DIAGNOSES =
      List.of(
          SecondaryResult.D,
          SecondaryResult.E,
          SecondaryResult.W,
          SecondaryResult.O,
          SecondaryResult.Z);
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
    long secondaryDValue = secondaryDmfValues.getDValue();

    boolean decayRisk =
        switch (ageOfChild) {
          case 0, 1, 2, 3 -> primaryDmftValue > 0;
          case 4 -> primaryDmftValue > 2;
          case 5 -> primaryDmftValue > 4;
          case 6, 7 -> primaryDmftValue + secondaryDmftValue > 5 || secondaryDValue > 0;
          case 8, 9 -> primaryDmftValue + secondaryDmftValue > 7 || secondaryDValue > 2;
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

    int primaryDValue = primaryDmfValues.getDValue();
    int secondaryDValue = secondaryDmfValues.getDValue();

    int primaryMValue = primaryDmfValues.getMValue();
    int secondaryMValue = secondaryDmfValues.getMValue();

    int primaryFValue = primaryDmfValues.getFValue();
    int secondaryFValue = secondaryDmfValues.getFValue();

    if (primaryDValue + secondaryDValue > 0) {
      return DecayStatus.TREATMENT_REQUIRED;
    }
    if (primaryDValue + secondaryDValue == 0
        && (primaryMValue + primaryFValue + secondaryMValue + secondaryFValue) > 0) {
      return DecayStatus.RESTORED;
    }
    return DecayStatus.HEALTHY;
  }

  public static DMFValues calculateDMFValues(
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
        dmfValues.increaseMValue();
      } else if (result.stream().anyMatch(D_DIAGNOSES::contains)) {
        dmfValues.increaseDValue();
      } else if (result.stream().anyMatch(F_DIAGNOSES::contains)) {
        dmfValues.increaseFValue();
      }
    }
    return dmfValues;
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

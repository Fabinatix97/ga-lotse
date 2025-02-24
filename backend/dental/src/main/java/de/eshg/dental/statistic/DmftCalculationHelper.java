/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import de.eshg.dental.domain.model.MainResult;
import de.eshg.dental.domain.model.Tooth;
import de.eshg.dental.domain.model.ToothDiagnosis;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

public class DmftCalculationHelper {
  private DmftCalculationHelper() {}

  public static long calculateDmftValue(
      Predicate<Tooth> expectedToothType, Map<Tooth, ToothDiagnosis> toothDiagnoses) {
    return toothDiagnoses.entrySet().stream()
        .filter(entry -> expectedToothType.test(entry.getKey()))
        .filter(entry -> hasDmfDiagnosis(entry.getValue()))
        .count();
  }

  private static boolean hasDmfDiagnosis(ToothDiagnosis diagnosis) {
    return List.of(MainResult.D, MainResult.E, MainResult.F).contains(diagnosis.mainResult());
  }
}

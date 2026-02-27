/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.util;

import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import java.util.Optional;
import java.util.function.Function;

public class ProcedureUtil {

  private ProcedureUtil() {}

  public static <F> F getFieldOrNull(
      InfectionBriefingProcedure procedure, Function<NewCertificateProcedure, F> getter) {
    return Optional.ofNullable(procedure)
        .filter(NewCertificateProcedure.class::isInstance)
        .map(NewCertificateProcedure.class::cast)
        .map(getter)
        .orElse(null);
  }
}

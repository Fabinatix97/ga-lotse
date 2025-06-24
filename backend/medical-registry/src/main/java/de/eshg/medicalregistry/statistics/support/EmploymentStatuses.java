/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.statistics.support;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.medicalregistry.domain.model.EmploymentStatus;
import java.util.function.Function;

public class EmploymentStatuses {

  private EmploymentStatuses() {}

  public static String toDescription(EmploymentStatus employmentStatus) {
    return switch (employmentStatus) {
      case SELF_EMPLOYED -> "Selbstständig";
      case FREELANCE -> "Freiberuflich";
      case EMPLOYEE -> "Angestellt";
    };
  }

  public static Function<EmploymentStatus, ValueOptionInternal> toValueOption() {
    return employmentStatus ->
        new ValueOptionInternal(employmentStatus.name(), toDescription(employmentStatus), false);
  }
}

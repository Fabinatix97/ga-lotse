/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.statistics.support;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.medicalregistry.domain.model.EmploymentType;
import java.util.function.Function;

public class EmploymentTypes {
  private EmploymentTypes() {}

  public static String toDescription(EmploymentType employmentType) {
    return switch (employmentType) {
      case FULL_TIME -> "Vollzeit";
      case PART_TIME -> "Teilzeit";
    };
  }

  public static Function<EmploymentType, ValueOptionInternal> toValueOption() {
    return employmentType ->
        new ValueOptionInternal(employmentType.name(), toDescription(employmentType), false);
  }
}

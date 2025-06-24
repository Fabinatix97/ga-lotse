/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.statistics.support;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.medicalregistry.domain.model.TypeOfChange;
import java.util.function.Function;

public class TypesOfChange {
  private TypesOfChange() {}

  public static String toDescription(TypeOfChange typeOfChange) {
    return switch (typeOfChange) {
      case TypeOfChange.NEW_REGISTRATION -> "Neuanmeldung";
      case TypeOfChange.SECOND_PRACTICE -> "Zweitpraxis";
      case TypeOfChange.RE_REGISTRATION -> "Wiederanmeldung";
      case TypeOfChange.CHANGE_OF_REGISTRATION -> "Ummeldung";
      case TypeOfChange.CHANGE_OF_NAME -> "Namensänderung";
      case TypeOfChange.RELOCATION -> "Wegzug";
      case TypeOfChange.DEREGISTRATION -> "Abmeldung";
      case TypeOfChange.CHANGE_OF_EMPLOYEES -> "Mitarbeiter:innen";
      case TypeOfChange.OTHER -> "Sonstiges";
    };
  }

  public static Function<TypeOfChange, ValueOptionInternal> toValueOption() {
    return typeOfChange ->
        new ValueOptionInternal(typeOfChange.name(), toDescription(typeOfChange), false);
  }
}

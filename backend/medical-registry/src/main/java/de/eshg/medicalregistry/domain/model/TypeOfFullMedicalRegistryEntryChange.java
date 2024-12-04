/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

public enum TypeOfFullMedicalRegistryEntryChange {
  NEW_REGISTRATION(TypeOfChange.NEW_REGISTRATION),
  SECOND_PRACTICE(TypeOfChange.SECOND_PRACTICE),
  RE_REGISTRATION(TypeOfChange.RE_REGISTRATION),
  CHANGE_OF_REGISTRATION(TypeOfChange.CHANGE_OF_REGISTRATION),
  CHANGE_OF_NAME(TypeOfChange.CHANGE_OF_NAME),
  OTHER(TypeOfChange.OTHER);

  private final TypeOfChange typeOfChange;

  TypeOfFullMedicalRegistryEntryChange(TypeOfChange typeOfChange) {
    this.typeOfChange = typeOfChange;
  }

  public TypeOfChange getTypeOfChange() {
    return typeOfChange;
  }
}

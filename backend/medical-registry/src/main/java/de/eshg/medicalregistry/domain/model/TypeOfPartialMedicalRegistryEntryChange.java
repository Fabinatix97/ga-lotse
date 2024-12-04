/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

public enum TypeOfPartialMedicalRegistryEntryChange {
  DEREGISTRATION(TypeOfChange.DEREGISTRATION),
  RELOCATION(TypeOfChange.RELOCATION),
  CHANGE_OF_NAME(TypeOfChange.CHANGE_OF_NAME),
  CHANGE_OF_REGISTRATION(TypeOfChange.CHANGE_OF_REGISTRATION),
  SECOND_PRACTICE(TypeOfChange.SECOND_PRACTICE);

  private final TypeOfChange typeOfChange;

  TypeOfPartialMedicalRegistryEntryChange(TypeOfChange typeOfChange) {
    this.typeOfChange = typeOfChange;
  }

  public TypeOfChange getTypeOfChange() {
    return typeOfChange;
  }
}

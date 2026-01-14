/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.model;

public enum TypeOfPartialMedicalRegistryEntryChange {
  DEREGISTRATION(TypeOfChange.DEREGISTRATION),
  RELOCATION(TypeOfChange.RELOCATION),
  CHANGE_OF_NAME(TypeOfChange.CHANGE_OF_NAME),
  CHANGE_OF_REGISTRATION(TypeOfChange.CHANGE_OF_REGISTRATION),
  SECOND_PRACTICE(TypeOfChange.SECOND_PRACTICE),
  CHANGE_OF_EMPLOYEES(TypeOfChange.CHANGE_OF_EMPLOYEES);

  private final TypeOfChange typeOfChange;

  TypeOfPartialMedicalRegistryEntryChange(TypeOfChange typeOfChange) {
    this.typeOfChange = typeOfChange;
  }

  public TypeOfChange getTypeOfChange() {
    return typeOfChange;
  }
}

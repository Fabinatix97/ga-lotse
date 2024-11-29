/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

public enum TypeOfDeregistration {
  DEREGISTRATION(TypeOfChange.DEREGISTRATION),
  RELOCATION(TypeOfChange.RELOCATION);

  private final TypeOfChange typeOfChange;

  TypeOfDeregistration(TypeOfChange typeOfChange) {
    this.typeOfChange = typeOfChange;
  }

  public TypeOfChange getTypeOfChange() {
    return typeOfChange;
  }
}

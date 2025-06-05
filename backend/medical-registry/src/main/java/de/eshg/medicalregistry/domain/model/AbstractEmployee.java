/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.procedure.domain.model.PersonType;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract sealed class AbstractEmployee extends Person permits Employee, EmployeeChange {
  protected AbstractEmployee() {
    super(PersonType.EMPLOYEE);
  }
}

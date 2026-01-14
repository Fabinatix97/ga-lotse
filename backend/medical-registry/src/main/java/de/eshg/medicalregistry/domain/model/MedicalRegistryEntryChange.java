/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.MappedSuperclass;
import java.util.List;
import java.util.stream.Collectors;

@MappedSuperclass
public abstract sealed class MedicalRegistryEntryChange extends MedicalRegistryProcedure
    permits PartialMedicalRegistryEntryChange, FullMedicalRegistryEntryChange {

  protected MedicalRegistryEntryChange() {}

  public MedicalRegistryEntryChange(TriggerType triggerType) {
    super(triggerType);
  }

  public abstract TypeOfChange getTypeOfChange();

  @Override
  public List<EmployeeChange> getEmployees() {
    return super.getEmployees().stream()
        .filter(EmployeeChange.class::isInstance)
        .map(EmployeeChange.class::cast)
        .collect(Collectors.toList());
  }
}

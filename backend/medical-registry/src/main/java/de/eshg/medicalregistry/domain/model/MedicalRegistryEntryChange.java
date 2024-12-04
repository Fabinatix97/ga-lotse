/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract sealed class MedicalRegistryEntryChange extends MedicalRegistryProcedure
    permits PartialMedicalRegistryEntryChange, FullMedicalRegistryEntryChange {

  protected MedicalRegistryEntryChange() {}

  public MedicalRegistryEntryChange(TriggerType triggerType) {
    super(triggerType);
  }

  public abstract TypeOfChange getTypeOfChange();
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.registry;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;

public interface MedicalRegistryEntryRepository extends ProcedureRepository<MedicalRegistryEntry> {

  long countByProcedureTypeAndProcedureStatus(
      ProcedureType procedureType, ProcedureStatus procedureStatus);

  default long numberOfCitizenDraftEntries() {
    return countByProcedureTypeAndProcedureStatus(
        ProcedureType.MEDICAL_REGISTRY_CITIZEN_DRAFT, ProcedureStatus.DRAFT);
  }
}

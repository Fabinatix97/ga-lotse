/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.repository;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;

public interface MedicalRegistryProcedureRepository
    extends ProcedureRepository<MedicalRegistryProcedure> {

  long countByProcedureTypeAndProcedureStatus(
      ProcedureType procedureType, ProcedureStatus procedureStatus);

  default long numberOfCitizenDraftEntries() {
    return countByProcedureTypeAndProcedureStatus(
        ProcedureType.MEDICAL_REGISTRY_CITIZEN_DRAFT, ProcedureStatus.DRAFT);
  }

  @Query("SELECT m.externalId FROM MedicalRegistryEntry m WHERE m.externalId IN :externalIds")
  Set<UUID> findExistingExternalIds(List<UUID> externalIds);
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.registry;

import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MedicalRegistryEntryRepository extends ProcedureRepository<MedicalRegistryEntry> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("FROM #{#entityName} p WHERE p.externalId = :externalId")
  Optional<MedicalRegistryEntry> findByExternalIdForUpdate(@Param("externalId") UUID externalId);
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.repository;

import de.eshg.prostituteprotection.domain.model.Consultation;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select c from Consultation c where c.id = (select p.id from ProstituteProtectionProcedure p where p.externalId = :procedureId)")
  Optional<Consultation> findByProcedureExternalIdForUpdate(UUID procedureId);

  Optional<Consultation> findByProcedureExternalId(UUID externalId);
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedureExpirationRepository extends JpaRepository<ProcedureExpiration, Long> {

  Page<ProcedureExpiration> findByCreatedAtBefore(Instant retentionTime, Pageable page);

  Optional<ProcedureExpiration> findByProcedureExternalId(UUID procedureExternalId);
}

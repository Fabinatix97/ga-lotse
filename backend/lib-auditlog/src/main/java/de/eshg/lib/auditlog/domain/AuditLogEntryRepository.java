/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog.domain;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogEntryRepository extends JpaRepository<AuditLogEntry, Long> {
  @EntityGraph(value = "AuditLogEntry.additionalData", type = EntityGraphType.LOAD)
  List<AuditLogEntry> findByCreatedAtBeforeOrderByCreatedAtAscIdAsc(Instant createdAt);
}

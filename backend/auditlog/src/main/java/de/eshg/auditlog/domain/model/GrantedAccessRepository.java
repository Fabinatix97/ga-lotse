/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.domain.model;

import de.eshg.auditlog.AuditLogSource;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface GrantedAccessRepository extends JpaRepository<GrantedAccess, Long> {

  Optional<GrantedAccess> findByAuditLogSourceAndDateAndIdOfGrantedUserAndExpiresAtIsAfter(
      AuditLogSource auditLogSource, LocalDate date, UUID idOfGrantedUser, Instant now);

  List<GrantedAccess> findByIdOfGrantedUserAndExpiresAtIsAfter(UUID idOfGrantedUser, Instant now);

  @Transactional(readOnly = true)
  boolean existsByAuditLogSourceAndDateAndExpiresAtIsAfter(
      AuditLogSource auditLogSource, LocalDate date, Instant now);

  @Query(
      """
            SELECT date as date, auditLogSource as auditLogSource, COUNT(DISTINCT idOfGrantedUser) as validGrantedAccessCount
            FROM GrantedAccess g
            WHERE g.expiresAt > :now
            AND date IN :dates
            AND auditLogSource IN :sources
            GROUP BY (date, auditLogSource)""")
  List<AuditLogGrantedAccessProjection> findByAuditLogInAndExpiresAtIsAfter(
      @Param("dates") Set<LocalDate> dates,
      @Param("sources") Set<AuditLogSource> sources,
      Instant now);

  @Transactional
  @Modifying
  @Query("DELETE FROM GrantedAccess g WHERE g.expiresAt <= :now")
  int deleteByIsExpired(Instant now);
}

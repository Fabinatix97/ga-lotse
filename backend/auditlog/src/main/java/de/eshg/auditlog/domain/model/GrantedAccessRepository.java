/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.domain.model;

import de.eshg.auditlog.AuditLogSource;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface GrantedAccessRepository extends JpaRepository<GrantedAccess, Long> {

  boolean existsByAuditLogSourceAndDateAndIdOfGrantedUserAndExpiresAtIsAfter(
      AuditLogSource auditLogSource, LocalDate date, UUID idOfGrantedUser, Instant now);

  @Query(
      """
          SELECT date as date, auditLogSource as auditLogSource, idOfGrantedUser as idOfGrantedUser, max(expiresAt) as expiresAt
          FROM GrantedAccess g
          WHERE expiresAt > :now
          AND idOfGrantedUser = :idOfGrantedUser
          GROUP BY (date, auditLogSource, idOfGrantedUser)""")
  List<AuditLogAccessibleProjection> findByIdOfGrantedUserAndExpiresAtIsAfter(
      @Param("idOfGrantedUser") UUID idOfGrantedUser, @Param("now") Instant now);

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
      @Param("now") Instant now);

  @Query(
      """
          SELECT idOfGrantedUser as idOfGrantedUser, max(expiresAt) as expiresAt
          FROM GrantedAccess g
          WHERE expiresAt > :now
          AND date = :date
          AND auditLogSource = :source
          GROUP BY idOfGrantedUser""")
  List<AuditLogGranteesProjection> findByAuditLogAndExpiresAtIsAfter(
      @Param("date") LocalDate date,
      @Param("source") AuditLogSource source,
      @Param("now") Instant now);

  @Transactional
  @Modifying
  @Query("DELETE FROM GrantedAccess g WHERE g.expiresAt <= :now")
  int deleteByIsExpired(Instant now);
}

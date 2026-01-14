/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence.repository;

import de.eshg.base.gdpr.persistence.GdprProcedure;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GdprProcedureRepository
    extends JpaRepository<GdprProcedure, Long>, JpaSpecificationExecutor<GdprProcedure> {

  Optional<GdprProcedure> findByExternalId(UUID externalId);

  void deleteByExternalId(UUID externalId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select p from GdprProcedure p where p.externalId = :externalId")
  Optional<GdprProcedure> findByExternalIdForUpdate(@Param("externalId") UUID externalId);

  @Query(
      """
    SELECT g.externalId
    FROM GdprProcedure g
    WHERE (g.status = de.eshg.base.gdpr.persistence.GdprProcedureStatus.CLOSED
      OR g.status = de.eshg.base.gdpr.persistence.GdprProcedureStatus.ABORTED)
      AND g.closedAt <= :cutOffDate
    ORDER BY g.closedAt DESC
    """)
  List<UUID> findIdsOfYoungestExpiredProcedures(
      @Param("cutOffDate") Instant cutOffDate, Pageable pageable);

  @Query(
      "select p from GdprProcedure p where p.identificationData.bpk2 = :bpk2 ORDER BY p.createdAt DESC")
  List<GdprProcedure> findByAssociatedBpk2(@Param("bpk2") String bpk2);

  @Query(
      "select p from GdprProcedure p where p.identificationData.dataTransmitterPseudonymId = :dataTransmitterPseudonymId ORDER BY p.createdAt DESC")
  List<GdprProcedure> findByAssociatedDataTransmitterPseudonymId(String dataTransmitterPseudonymId);

  @Query(
      """
    SELECT procedure.externalId FROM GdprProcedure procedure
    WHERE EXISTS (SELECT 1 FROM procedure.downloads download
        WHERE download.downloadId IN :downloadIds)
    ORDER BY procedure.id ASC
    LIMIT 1
    """)
  Optional<UUID> findFirstByDownloadIds(@Param("downloadIds") Collection<UUID> downloadIds);
}

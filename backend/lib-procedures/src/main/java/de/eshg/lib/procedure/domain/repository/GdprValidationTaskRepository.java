/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GdprValidationTaskRepository
    extends JpaRepository<GdprValidationTask, Long>, JpaSpecificationExecutor<GdprValidationTask> {

  Optional<GdprValidationTask> findByGdprProcedureId(UUID gdprProcedureId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("FROM GdprValidationTask p WHERE p.gdprProcedureId = :gdprProcedureId")
  Optional<GdprValidationTask> findByExternalIdForUpdate(
      @Param("gdprProcedureId") UUID gdprProcedureId);

  @Query(
      "SELECT COUNT(t) AS count, MIN(t.startedAt) AS oldestStartDate FROM GdprValidationTask t WHERE t.status = de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus.OPEN")
  OpenTaskSummaryRawData getOpenTaskSummary();

  void deleteByGdprProcedureId(UUID gdprProcedureId);
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.repository;

import de.eshg.dental.domain.model.Examination;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExaminationRepository
    extends JpaRepository<Examination, Long>, JpaSpecificationExecutor<Examination> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select e from Examination e where e.externalId = :examinationId")
  Optional<Examination> findOneByExternalIdForUpdate(@Param("examinationId") UUID examinationId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select e from Examination e where e.externalId in :examinationIds order by e.id")
  List<Examination> findAllByExternalIdsForUpdate(
      @Param("examinationIds") List<UUID> examinationIds);

  @Query(
      """
    select e from Examination e
    where e.child.procedureStatus = :status
    order by e.id""")
  List<Examination> findAllByChildStatus(@Param("status") ProcedureStatus status);

  Optional<Examination> findByExternalId(UUID examinationId);
}

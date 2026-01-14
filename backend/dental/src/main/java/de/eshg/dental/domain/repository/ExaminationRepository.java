/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.domain.repository;

import de.eshg.dental.domain.model.Examination;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ExaminationRepository
    extends JpaRepository<Examination, Long>, JpaSpecificationExecutor<Examination> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select e from Examination e where e.externalId = :examinationId")
  Optional<Examination> findOneByExternalIdForUpdate(@Param("examinationId") UUID examinationId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select e.id from Examination e where e.externalId in :examinationIds order by e.id")
  List<Long> findAllByExternalIdsForUpdate(@Param("examinationIds") List<UUID> examinationIds);

  @Query(
      """
    select e from Examination e
    join fetch e.child
    join fetch e.prophylaxisSession
    left join fetch e.result
    where e.id in :ids
    order by e.id""")
  Stream<Examination> fetchByIds(@Param("ids") List<Long> ids);

  @Query(
      """
    select e from Examination e
    where e.child.procedureStatus = :status
    and e.result is null
    order by e.id""")
  List<Examination> findAllByChildStatusWhereResultIsNull(@Param("status") ProcedureStatus status);

  Optional<Examination> findByExternalId(UUID examinationId);

  @Query(
      """
    select e from Examination e
    join fetch e.child
    join fetch e.prophylaxisSession
    left join fetch e.result
    join e.child.relatedPersons rp on rp.personType = :personType
    where rp.centralFileStateId in :fileStateIds
    order by e.prophylaxisSession.dateAndTime desc, e.id""")
  Stream<Examination> findAllByPersonFileStateIds(
      @Param("personType") PersonType personType, @Param("fileStateIds") List<UUID> fileStateIds);
}

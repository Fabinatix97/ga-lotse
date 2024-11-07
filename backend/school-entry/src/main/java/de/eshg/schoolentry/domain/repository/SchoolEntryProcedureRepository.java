/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure_;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SchoolEntryProcedureRepository extends ProcedureRepository<SchoolEntryProcedure> {

  @Override
  @EntityGraph(attributePaths = SchoolEntryProcedure_.APPOINTMENT)
  Page<SchoolEntryProcedure> findAll(Specification<SchoolEntryProcedure> spec, Pageable pageable);

  @Query("select p from SchoolEntryProcedure p where p.externalId in :externalIds order by p.id")
  @EntityGraph(
      attributePaths = {
        SchoolEntryProcedure_.WAITING_ROOM,
        SchoolEntryProcedure_.HEARING_TEST_RESULT,
        SchoolEntryProcedure_.EYE_EXAMINATION_RESULT,
        SchoolEntryProcedure_.SOPESS_EXAMINATION_RESULT,
        SchoolEntryProcedure_.DEVELOPMENT_SCREENING_RESULT,
        SchoolEntryProcedure_.VACCINATION_STATUS,
        SchoolEntryProcedure_.ANAMNESIS
      })
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  List<SchoolEntryProcedure> findForBatchDeletion(@Param("externalIds") List<UUID> externalIds);

  @Query(
      """
      select s from SchoolEntryProcedure s
      join s.relatedPersons p
      where p.centralFileStateId in :centralFileStateIds
      order by s.id
      """)
  @EntityGraph(attributePaths = SchoolEntryProcedure_.APPOINTMENT)
  Stream<SchoolEntryProcedure> findByRelatedPersons(
      @Param("centralFileStateIds") List<UUID> centralFileStateIds);

  @Query(
      "select s from SchoolEntryProcedure s where s.citizenUserId = :citizenUserId and s.procedureStatus <> de.eshg.lib.procedure.domain.model.ProcedureStatus.CLOSED")
  Optional<SchoolEntryProcedure> findOneByCitizenUserId(UUID citizenUserId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select s from SchoolEntryProcedure s where s.citizenUserId = :citizenUserId and s.procedureStatus <> de.eshg.lib.procedure.domain.model.ProcedureStatus.CLOSED")
  Optional<SchoolEntryProcedure> findOneByCitizenUserIdForUpdate(
      @Param("citizenUserId") UUID citizenUserId);

  @Modifying
  @Query(
      "update SchoolEntryProcedure p set p.citizenUserId = null where p.externalId = :externalId")
  void clearCitizenUserId(@Param("externalId") UUID externalId);

  @Query(
      "select p.externalId from SchoolEntryProcedure p where p.procedureStatus = de.eshg.lib.procedure.domain.model.ProcedureStatus.CLOSED order by p.id")
  List<UUID> findExternalIdsOfClosedProcedures();

  @Query(
      """
      select f from SchoolEntryProcedure p
      join p.progressEntries pe
      join pe.file f
      where p.externalId in :procedureIds
      and p.appointment is not null
      and pe.id = (
        select max(spe.id) from SystemProgressEntry spe
        where spe.procedureId = p.id
        and spe.systemProgressEntryType = :systemProgressEntryType
      )
      order by f.fileName, f.id
      """)
  List<File> findInvitationLettersForProcedures(
      @Param("procedureIds") List<UUID> procedureIds,
      @Param("systemProgressEntryType") String systemProgressEntryType);
}

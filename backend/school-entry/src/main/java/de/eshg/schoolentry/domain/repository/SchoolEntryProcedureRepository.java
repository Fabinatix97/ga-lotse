/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.schoolentry.api.WeeklyDataBinDto;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure_;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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
      where exists (
          select 1 from s.relatedPersons p
          where p.centralFileStateId in :centralFileStateIds
      )
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

  @Modifying
  @Query(
      "update SchoolEntryProcedure p set p.schoolId = :newSchoolId where p.schoolId = :oldSchoolId")
  int replaceSchoolId(
      @Param("oldSchoolId") UUID oldSchoolId, @Param("newSchoolId") UUID newSchoolId);

  @Modifying
  @Query(
      "update SchoolEntryProcedure p set p.locationId = :newLocationId where p.locationId = :oldLocationId")
  int replaceLocationId(
      @Param("oldLocationId") UUID oldLocationId, @Param("newLocationId") UUID newLocationId);

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
        select spe.id from SystemProgressEntry spe
        where spe.procedureId = p.id
        and spe.keyDocumentType = :keyDocumentType
        order by spe.keyDocumentVersion desc
        limit 1
      )
      order by f.fileName, f.id
      """)
  List<File> findInvitationLettersForProcedures(
      @Param("procedureIds") List<UUID> procedureIds,
      @Param("keyDocumentType") String keyDocumentType);

  List<SchoolEntryProcedure> findByAppointmentIn(List<Appointment> appointments);

  Slice<SchoolEntryProcedure>
      findByIdGreaterThanAndAppointmentIsNotNullAndChildAgeIsNullOrderByIdAsc(
          Long lastId, PageRequest of);

  @Query(
      """
        select new de.eshg.schoolentry.api.WeeklyDataBinDto(cast(date_trunc('week', a.appointmentStart) as LocalDate), count(p))
        from SchoolEntryProcedure p
        join p.appointment a
        where :userId in (p.firstEyeExaminationOrHearingTestModifiedBy, p.firstSchoolInfoLetterGeneratedBy)
        and a.appointmentStart >= :start
        and a.appointmentEnd < :end
        and p.statisticsInclusion <> de.eshg.lib.procedure.domain.model.StatisticsInclusion.EXCLUDE
        group by date_trunc('week', a.appointmentStart)
        order by date_trunc('week', a.appointmentStart)
        """)
  List<WeeklyDataBinDto> getExaminationDates(
      @Param("userId") UUID userId, @Param("start") Instant start, @Param("end") Instant end);

  @Query(
      """
  select count(p)
    from SchoolEntryProcedure p
  where p.isInvitationSent = true
    and p.createdAt between :start and :end""")
  long countInvitationSentTrueCreatedAtBetween(
      @Param("start") Instant start, @Param("end") Instant end);

  @Query(
      """
  select count(p)
    from SchoolEntryProcedure p
  where p.appointmentChangesByCitizen >= :times
    and p.createdAt between :start and :end""")
  long countByAppointmentChangedAtLeastTimesByCitizenCreatedAtBetween(
      @Param("times") int times, @Param("start") Instant start, @Param("end") Instant end);

  @Query(
      """
    select count(p)
        from SchoolEntryProcedure p
    where
        p.createdAt between :start and :end
            and exists (
                SELECT 1
                    FROM SystemProgressEntry spe
                    WHERE spe.procedureId = p.id
                    AND spe.systemProgressEntryType = :type
                )
    """)
  long countBySystemProgressEntryTypeExistCreatedAtBetween(
      @Param("type") String type, @Param("start") Instant start, @Param("end") Instant end);
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.ArchivingRelevance;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskType;
import jakarta.persistence.LockModeType;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ProcedureRepository<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>>
    extends JpaRepository<ProcedureT, Long>, JpaSpecificationExecutor<ProcedureT> {

  Optional<ProcedureT> findByExternalId(UUID externalId);

  @Query(
      """
    select p.externalId from #{#entityName} p
    where p.externalId in :externalIds
    order by p.id""")
  List<UUID> collectExistingProceduresByExternalIds(
      @Param("externalIds") Collection<UUID> externalIds);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("FROM #{#entityName} p WHERE p.externalId = :externalId")
  Optional<ProcedureT> findByExternalIdForUpdate(@Param("externalId") UUID externalId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("FROM #{#entityName} p WHERE p.externalId IN :externalIds ORDER BY p.id")
  Stream<ProcedureT> findByExternalIdsForUpdate(@Param("externalIds") List<UUID> externalIds);

  @Query(
      """
    SELECT (p.closedAt - p.createdAt) AS duration FROM #{#entityName} p
    WHERE p.procedureType = :type
    AND p.procedureStatus = :status
    AND p.createdAt BETWEEN :start AND :end
    AND p.closedAt IS NOT NULL
    ORDER BY p.id""")
  List<Duration> findProcedureDurations(
      @Param("type") ProcedureType type,
      @Param("status") ProcedureStatus status,
      @Param("start") Instant start,
      @Param("end") Instant end);

  @Query("SELECT DISTINCT p.procedureType FROM #{#entityName} p ORDER BY p.procedureType")
  Set<ProcedureType> findDistinctProcedureTypes();

  @Query(
      """
    SELECT p.procedureStatus AS status, COUNT(p) AS count FROM #{#entityName} p
    WHERE p.procedureType = :type
      AND p.createdAt BETWEEN :start AND :end
    GROUP BY p.procedureStatus
    ORDER BY p.procedureStatus""")
  Stream<StatusAndCount> findStatusCountsForTypeWithinTimeRange(
      @Param("type") ProcedureType procedureType,
      @Param("start") Instant start,
      @Param("end") Instant end);

  interface StatusAndCount {
    ProcedureStatus getStatus();

    long getCount();
  }

  @Query(
      """
    SELECT COUNT(DISTINCT p.id) FROM #{#entityName}  p
    WHERE p.procedureType = :type
    AND p.procedureStatus = 'CLOSED'
    AND p.createdAt BETWEEN :start AND :end
    """)
  Long countClosedProcedures(
      @Param("type") ProcedureType procedureType,
      @Param("start") Instant start,
      @Param("end") Instant end);

  @Query(
      """
    SELECT COUNT(p) FROM #{#entityName} p
    LEFT JOIN p.tasks t ON t.taskType = :taskType
    WHERE p.procedureType = :type
    AND p.procedureStatus = 'CLOSED'
    AND p.createdAt BETWEEN :start AND :end
    AND (t IS NULL OR t.taskType != :taskType)
    """)
  long countClosedProceduresWithoutTaskType(
      @Param("type") ProcedureType procedureType,
      @Param("taskType") TaskType taskType,
      @Param("start") Instant start,
      @Param("end") Instant end);

  @Query(
      """
    SELECT p FROM #{#entityName} p
    WHERE p.procedureType = :type
    AND p.procedureStatus = 'CLOSED'
    AND p.createdAt BETWEEN :start AND :end
    AND p.closedAt IS NOT NULL
    ORDER BY (p.closedAt - p.createdAt) ASC, p.id ASC
    LIMIT :limit
  """)
  List<ProcedureT> findClosedProceduresSortedByDurationsAsc(
      @Param("type") ProcedureType type,
      @Param("start") Instant start,
      @Param("end") Instant end,
      @Param("limit") int limit);

  @Query(
      """
    SELECT p FROM #{#entityName} p
    WHERE p.procedureType = :type
    AND p.procedureStatus = 'CLOSED'
    AND p.createdAt BETWEEN :start AND :end
    AND p.closedAt IS NOT NULL
    ORDER BY (p.closedAt - p.createdAt) DESC, p.id DESC
    LIMIT :limit
  """)
  List<ProcedureT> findClosedProceduresSortedByDurationsDesc(
      @Param("type") ProcedureType type,
      @Param("start") Instant start,
      @Param("end") Instant end,
      @Param("limit") int limit);

  @Query("select p.externalId from #{#entityName} p where p.id = :id")
  Optional<UUID> findExternalIdForId(@Param("id") Long id);

  @Query(
      """
          SELECT procedure.externalId from #{#entityName} procedure
          JOIN procedure.progressEntries progressEntry
          JOIN progressEntry.file file
          WHERE file.externalId = :fileExternalId
          """)
  Optional<UUID> findExternalIdByFileExternalId(@Param("fileExternalId") UUID fileExternalId);

  @Query(
      """
        SELECT procedure.procedureStatus from #{#entityName} procedure
        JOIN procedure.progressEntries progressEntry
        WHERE progressEntry.file = :file
        """)
  Optional<ProcedureStatus> findStatusByFile(@Param("file") File file);

  @Query(
      """
        SELECT procedure from #{#entityName} procedure
        JOIN procedure.progressEntries progressEntry
        WHERE progressEntry.file = :file
        """)
  Optional<ProcedureT> findByFile(@Param("file") File file);

  List<ProcedureT> findByRelatedPersonsCentralFileStateIdInOrderByCreatedAtDescIdAsc(
      Collection<UUID> centralFileStateIds);

  @Query(
      """
 SELECT procedure from #{#entityName} procedure
JOIN procedure.relatedPersons relatedPerson
WHERE relatedPerson.centralFileStateId IN :centralFileStateIds
AND relatedPerson.personType = :personType
ORDER BY procedure.createdAt DESC, procedure.id ASC
""")
  List<ProcedureT> findByRelatedPersonsCentralFileStateIds(
      @Param("centralFileStateIds") Collection<UUID> centralFileStateIds,
      @Param("personType") PersonType personType);

  @Query(
      """
    SELECT procedure from #{#entityName} procedure
    JOIN procedure.relatedPersons relatedPerson
    WHERE relatedPerson.centralFileStateId IN :centralFileStateIds
    AND relatedPerson.personType = :personType
    AND procedure.procedureStatus = :procedureStatus
    ORDER BY procedure.createdAt DESC, procedure.id ASC
    """)
  List<ProcedureT> findByRelatedPersonsCentralFileStateIds(
      @Param("centralFileStateIds") Collection<UUID> centralFileStateIds,
      @Param("personType") PersonType personType,
      @Param("procedureStatus") ProcedureStatus procedureStatus);

  List<ProcedureT> findAllByArchivingRelevance(ArchivingRelevance archivingRelevance);

  List<ProcedureT> findByProcedureStatusIn(Set<ProcedureStatus> procedureStatuses);

  @Query(
      """
        SELECT relatedPerson.centralFileStateId FROM #{#entityName} procedure
        JOIN procedure.relatedPersons relatedPerson
        WHERE procedure.procedureStatus IN :procedureStatuses
        """)
  List<UUID> findAllRelatedPersonFileStateIdsByProcedureStatus(
      @Param("procedureStatuses") Set<ProcedureStatus> procedureStatuses);

  @Query(
      """
      SELECT relatedFacility.centralFileStateId FROM #{#entityName} procedure
      JOIN procedure.relatedFacilities relatedFacility
      WHERE procedure.procedureStatus IN :procedureStatuses
      """)
  List<UUID> findAllRelatedFacilitiesFileStateIdsByProcedureStatus(
      @Param("procedureStatuses") Set<ProcedureStatus> procedureStatuses);

  default int sumFileSizeBytesOrZero(@Param("externalIds") Set<UUID> externalIds) {
    return Optional.ofNullable(sumFileSizeBytes(externalIds)).orElse(0);
  }

  @Query(
      """
        SELECT SUM(file.fileSizeBytes) FROM #{#entityName} procedure
        LEFT JOIN procedure.progressEntries progressEntry
        LEFT JOIN progressEntry.file file
        WHERE procedure.externalId IN :externalIds""")
  Integer sumFileSizeBytes(@Param("externalIds") Set<UUID> externalIds);
}

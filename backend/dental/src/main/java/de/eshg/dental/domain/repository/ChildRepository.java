/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.repository;

import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Person;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import jakarta.persistence.LockModeType;
import java.time.Year;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChildRepository extends ProcedureRepository<Child> {

  @Modifying
  @Query(
      "update Child c set c.institutionId = :newInstitutionId where c.institutionId = :oldInstitutionId")
  int replaceInstitutionId(
      @Param("oldInstitutionId") UUID oldInstitutionId,
      @Param("newInstitutionId") UUID newInstitutionId);

  @Query(
      value =
          """
          select distinct c.groupName from Child c
          where c.groupName is not null
          and c.institutionId = :institutionId
          and (:openGroupsOnly is false or c.procedureStatus='OPEN')
          order by c.groupName
          """)
  List<String> findDistinctInstitutionGroups(
      @Param("institutionId") UUID institutionId, @Param("openGroupsOnly") boolean openGroupsOnly);

  List<Child> findByInstitutionIdAndGroupNameAndProcedureStatusOrderById(
      UUID institutionId, String groupName, ProcedureStatus procedureStatus);

  List<Child> findByInstitutionIdAndGroupNameAndProcedureStatusAndYearOrderById(
      UUID institutionId, String groupName, ProcedureStatus procedureStatus, Year year);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select c from Child c where c.institutionId = :institutionId and c.groupName in :groupNames and c.procedureStatus='OPEN' and c.year = :year")
  List<Child> findByInstitutionIdAndGroupNameAndYearForUpdate(
      UUID institutionId, List<String> groupNames, Year year);

  List<Child> findByInstitutionIdAndYearAndProcedureStatus(
      UUID institutionId, Year year, ProcedureStatus procedureStatus);

  List<Child> findByInstitutionIdAndProcedureStatusOrderById(
      UUID institutionId, ProcedureStatus status);

  boolean existsByInstitutionIdAndGroupNameAndProcedureStatus(
      UUID institutionId, String groupName, ProcedureStatus status);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select p from Person p where p.procedure.externalId = :childId and p.centralFileStateId = :fileStateId")
  Person findByProcedureExternalIdAndFileStateIdForUpdate(
      @Param("childId") UUID childId, @Param("fileStateId") UUID fileStateId);

  @Query(
      nativeQuery = true,
      value =
          """
        select
          institution_id as institutionId,
          count(*) as totalCount,
          sum(case when totalChildren = completedChildren then 1 else 0 end) as completedCount
        from
          (
          select
              c.institution_id,
              c.group_name,
              count(*) as totalChildren,
              sum(case when c.procedure_status = 'CLOSED' then 1 else 0 end) as completedChildren
          from
              Child c
          where
              c.year = :schoolYear
          group by
              c.group_name,
              c.institution_id) as group_status
        group by
            institution_id
      """)
  List<InstitutionCounts> getInstitutionsAndCompletedGroups(@Param("schoolYear") Year schoolYear);

  @Query(
      nativeQuery = true,
      value =
          """
          select
              institution_id as institutionId,
              count(*) as totalCount,
              sum(case when c.procedure_status = 'CLOSED' then 1 else 0 end) as completedCount
          from
              Child c
          where
              c.year = :schoolYear
          group by
              institution_id
      """)
  List<InstitutionCounts> getInstitutionsAndCompletedChildren(@Param("schoolYear") Year schoolYear);

  interface InstitutionCounts {
    UUID getInstitutionId();

    int getTotalCount();

    int getCompletedCount();
  }
}

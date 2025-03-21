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
      "select distinct c.groupName from Child c where c.institutionId = :institutionId order by c.groupName")
  List<String> findDistinctInstitutionGroups(@Param("institutionId") UUID institutionId);

  List<Child> findByInstitutionIdAndGroupNameAndProcedureStatusOrderById(
      UUID institutionId, String groupName, ProcedureStatus procedureStatus);

  List<Child> findByInstitutionIdAndProcedureStatusOrderById(
      UUID institutionId, ProcedureStatus status);

  List<Child> findByProcedureStatusOrderById(ProcedureStatus status);

  boolean existsByInstitutionIdAndGroupNameAndProcedureStatus(
      UUID institutionId, String groupName, ProcedureStatus status);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select p from Person p where p.procedure.externalId = :childId and p.centralFileStateId = :fileStateId")
  Person findByProcedureExternalIdAndFileStateIdForUpdate(
      @Param("childId") UUID childId, @Param("fileStateId") UUID fileStateId);
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.schoolentry.domain.model.Person;
import jakarta.persistence.LockModeType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PersonRepository extends JpaRepository<Person, Long> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select p from Person p where p.procedure.externalId = :procedureId and p.personType = :type")
  Person findByProcedureExternalIdAndTypeForUpdate(
      @Param("procedureId") UUID procedureId, @Param("type") PersonType type);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      "select p from Person p where p.procedure.externalId = :procedureId and p.centralFileStateId = :fileStateId")
  Person findByProcedureExternalIdAndFileStateIdForUpdate(
      @Param("procedureId") UUID procedureId, @Param("fileStateId") UUID fileStateId);
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.repository;

import de.eshg.dental.domain.model.Child;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChildRepository
    extends JpaRepository<Child, Long>, JpaSpecificationExecutor<Child> {

  @Modifying
  @Query(
      "update Child c set c.institutionId = :newInstitutionId where c.institutionId = :oldInstitutionId")
  int replaceInstitutionId(
      @Param("oldInstitutionId") UUID oldInstitutionId,
      @Param("newInstitutionId") UUID newInstitutionId);

  Optional<Child> findByExternalId(UUID externalId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("FROM #{#entityName} p WHERE p.externalId = :externalId")
  Optional<Child> findByExternalIdForUpdate(@Param("externalId") UUID externalId);

  @Query(
      """
      select c
      from Child c
      where c.childIdFromCentralFile in :centralFileStateIds
      order by c.id
      """)
  Stream<Child> findByCentralFileStateIds(
      @Param("centralFileStateIds") List<UUID> centralFileStateIds);
}

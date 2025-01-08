/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.persistence.repository;

import de.eshg.lib.common.FederalState;
import de.eshg.servicedirectory.actor.persistence.entity.ActorType;
import de.eshg.servicedirectory.actor.persistence.entity.AuditedActor;
import de.eshg.servicedirectory.orgunit.persistence.entity.OrgUnitType;
import de.eshg.servicedirectory.rule.persistence.entity.ActorSelector;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditedActorRepository extends JpaRepository<AuditedActor, UUID> {

  Optional<AuditedActor> findByCommonName(String commonName);

  Optional<AuditedActor> findByOrgUnitIdAndReadableName(UUID orgUnitId, String readableName);

  @Query(
      """
          SELECT a
          FROM AuditedActor a
          WHERE a.active = true
          AND a.orgUnit.active = true
          ORDER BY a.id
          """)
  List<AuditedActor> findAllActive();

  default List<AuditedActor> findAllBySelector(ActorSelector selector) {
    // we can't use ActorSelector directly because there isn't a way to get the
    // name() of an Enum entity attribute (like 'type') inside the custom query
    return findAllBy(
        selector.federalState() == null
            ? null
            : FederalState.valueOf(selector.federalState()).name(),
        selector.orgUnitType() == null ? null : OrgUnitType.valueOf(selector.orgUnitType()).name(),
        selector.orgUnitName(),
        selector.actorType() == null ? null : ActorType.valueOf(selector.actorType()).name(),
        selector.actorName());
  }

  @Query(
      """
            SELECT a
            FROM AuditedActor a
            WHERE a.active = true
            AND (:federalState is null OR cast(a.orgUnit.federalState as string) = :federalState)
            AND (:orgUnitType is null OR cast(a.orgUnit.type as string) = :orgUnitType)
            AND (:orgUnitName is null OR a.orgUnit.readableName = :orgUnitName)
            AND (:actorType is null OR cast(a.type as string) = :actorType)
            AND (:actorName is null OR a.readableName = :actorName)
            ORDER BY a.id
            """)
  List<AuditedActor> findAllBy(
      @Param("federalState") String federalState,
      @Param("orgUnitType") String orgUnitType,
      @Param("orgUnitName") String orgUnitName,
      @Param("actorType") String actorType,
      @Param("actorName") String actorName);
}

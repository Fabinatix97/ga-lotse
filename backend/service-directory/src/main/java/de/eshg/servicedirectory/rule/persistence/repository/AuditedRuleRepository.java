/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.persistence.repository;

import de.eshg.servicedirectory.rule.persistence.entity.ActorSelector;
import de.eshg.servicedirectory.rule.persistence.entity.AuditedRule;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditedRuleRepository extends JpaRepository<AuditedRule, UUID> {
  List<AuditedRule> findAllByActiveIsTrue();

  @Query(
      """
            SELECT e
            FROM AuditedRule e
            WHERE e.active = true
            AND (e.client.federalState is null OR e.client.federalState = :#{#actorSelector.federalState()})
            AND (e.client.orgUnitType is null OR e.client.orgUnitType = :#{#actorSelector.orgUnitType()})
            AND (e.client.orgUnitName is null OR e.client.orgUnitName = :#{#actorSelector.orgUnitName()})
            AND (e.client.actorType is null OR e.client.actorType = :#{#actorSelector.actorType()})
            AND (e.client.actorName is null OR e.client.actorName = :#{#actorSelector.actorName()})
            """)
  List<AuditedRule> findActiveWhereWeAreClient(@Param("actorSelector") ActorSelector actorSelector);

  @Query(
      """
            SELECT e
            FROM AuditedRule e
            WHERE e.active = true
            AND (e.server.federalState is null OR e.server.federalState = :#{#actorSelector.federalState()})
            AND (e.server.orgUnitType is null OR e.server.orgUnitType = :#{#actorSelector.orgUnitType()})
            AND (e.server.orgUnitName is null OR e.server.orgUnitName = :#{#actorSelector.orgUnitName()})
            AND (e.server.actorType is null OR e.server.actorType = :#{#actorSelector.actorType()})
            AND (e.server.actorName is null OR e.server.actorName = :#{#actorSelector.actorName()})
            """)
  List<AuditedRule> findActiveWhereWeAreServer(@Param("actorSelector") ActorSelector actorSelector);
}

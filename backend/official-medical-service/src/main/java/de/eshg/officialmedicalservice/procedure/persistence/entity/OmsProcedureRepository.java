/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OmsProcedureRepository extends ProcedureRepository<OmsProcedure> {
  @Query(
      """
    select o from OmsProcedure o
    where exists (
        select 1 from o.relatedPersons p
        where p.centralFileStateId in :centralFileStateIds
    )
    order by o.id
    """)
  Stream<OmsProcedure> findByRelatedPersons(
      @Param("centralFileStateIds") List<UUID> centralFileStateIds);

  @Query(
      """
    select o from OmsProcedure o
    where exists (
        select 1 from o.relatedFacilities f
        where f.centralFileStateId in :centralFileStateIds
    )
    order by o.id
    """)
  Stream<OmsProcedure> findByRelatedFacility(
      @Param("centralFileStateIds") List<UUID> centralFileStateIds);

  @Query(
      """
    select distinct o.physicianId from OmsProcedure o where o.physicianId is not null
    """)
  List<UUID> findDistinctPhysicianIds();

  @Query(
      """
    select o from OmsProcedure o
    where o.waitingRoom.status in ('WAITING_FOR_CONSULTATION', 'IN_CONSULTATION')
    """)
  Stream<OmsProcedure> findAllByWaitingRoomStatusInWaitingOrInConsultation();

  Optional<OmsProcedure> getByCitizenUserId(UUID citizenUserId);

  @Query(
      """
        SELECT o
        FROM OmsProcedure o
        WHERE (o.procedureStatus = de.eshg.lib.procedure.domain.model.ProcedureStatus.CLOSED
          OR o.procedureStatus = de.eshg.lib.procedure.domain.model.ProcedureStatus.ABORTED)
        AND o.closedAt <= :cutOffDate
        AND o.citizenUserId IS NOT NULL
        ORDER BY o.id
        """)
  List<OmsProcedure> findClosedProceduresWithExistingKeycloakUsers(
      @Param("cutOffDate") Instant cutOffDate);
}

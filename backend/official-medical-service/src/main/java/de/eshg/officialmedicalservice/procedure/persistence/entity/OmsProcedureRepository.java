/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
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
}

/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.persistence;

import de.eshg.inspection.inspection.api.InspectionResult;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface FacilityRepository
    extends JpaRepository<Facility, Long>, JpaSpecificationExecutor<Facility> {

  Optional<Facility> findByExternalId(UUID externalId);

  Optional<Facility> findByCentralFileStateId(UUID centralFileStatId);

  List<Facility> findAllByCentralFileStateIdIn(List<UUID> centralFileStateIds);

  @Query("select id from Facility where possibleDuplicates = true")
  List<Long> getFacilityIdsWithDuplicates();

  List<Facility> findAllByBannedTrueOrderByLastInspectedAscIdAsc();

  @Query(
      """
        select irf.centralFileStateId
        from Inspection i
        join InspectionRelatedFacility irf on irf.procedure = i
        join Facility f on f = irf.facility
        where f = :facility
          and i.procedureStatus = de.eshg.lib.procedure.domain.model.ProcedureStatus.CLOSED
          and i.executionAppointment.appointmentStart >= :startTime
          and i.executionAppointment.appointmentEnd < :endTime
        order by i.executionAppointment.appointmentStart desc
        limit 1
        """)
  Optional<UUID> findNewestCentralFileStateIdForFacilityWithExecutionAppointmentIn(
      Facility facility, Instant startTime, Instant endTime);

  @Query(
      """
        select irf.centralFileStateId
        from Inspection i
        join InspectionRelatedFacility irf on irf.procedure = i
        join Facility f on f = irf.facility
        where f = :facility
        order by i.createdAt desc
        limit 1
        """)
  Optional<UUID> findNewestCentralFileStateIdForFacility(Facility facility);

  @Query(
      """
        select count(i) > 0
        from Inspection i
        join InspectionRelatedFacility irf on irf.procedure = i
        join Facility f on f = irf.facility
        where f = :facility
          and i.procedureStatus = de.eshg.lib.procedure.domain.model.ProcedureStatus.CLOSED
          and i.executionAppointment.appointmentStart >= :startTime
          and i.executionAppointment.appointmentEnd < :endTime
          and i.result in :results
        """)
  Optional<Boolean> findHasInspectionsWithResultForFacility(
      Facility facility, Instant startTime, Instant endTime, List<InspectionResult> results);

  @Query(
      """
    select count(i) > 0
    from Inspection i
    join InspectionRelatedFacility irf on irf.procedure = i
    join Facility f on f = irf.facility
    where f = :facility
      and i.procedureStatus = de.eshg.lib.procedure.domain.model.ProcedureStatus.CLOSED
      and i.executionAppointment.appointmentStart >= :startTime
      and i.executionAppointment.appointmentEnd < :endTime
    """)
  Optional<Boolean> findHasInspectionsForFacility(
      Facility facility, Instant startTime, Instant endTime);

  @Query(
      """
        select distinct f
        from Inspection i
        join InspectionRelatedFacility irf on irf.procedure = i
        join Facility f on f = irf.facility
        where i.createdAt < :endTime
        order by f.id asc
        """)
  Page<Facility> findFacilitiesWithInspectionsBefore(Instant endTime, Pageable pageable);
}

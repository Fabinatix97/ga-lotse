/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface InspectionRepository extends ProcedureRepository<Inspection> {

  @Query(
      """
              select i
              from Inspection i
              join InspectionRelatedFacility irf on irf.procedure = i
              join Facility f on f = irf.facility
              where f = :facility
              and i.procedureStatus in (
                de.eshg.lib.procedure.domain.model.ProcedureStatus.DRAFT,
                de.eshg.lib.procedure.domain.model.ProcedureStatus.OPEN,
                de.eshg.lib.procedure.domain.model.ProcedureStatus.IN_PROGRESS
              )
              order by i.modifiedAt desc
              limit 1
              """)
  Inspection findNewestOpenInspectionForFacility(Facility facility);

  @Query(
      """
              select i
              from Inspection i
              join InspectionRelatedFacility irf on irf.procedure = i
              join Facility f on f = irf.facility
              where f = :facility
              and i.procedureStatus in (
                de.eshg.lib.procedure.domain.model.ProcedureStatus.CLOSED
              )
              order by i.modifiedAt desc
              limit 1
              """)
  Inspection findNewestClosedInspectionForFacility(Facility facility);

  @Query(
      """
            select i
            from Inspection i
            join InspectionRelatedFacility irf on irf.procedure = i
            join Facility f on f = irf.facility
            where f = :facility
            """)
  List<Inspection> findAllInspectionsForFacility(Facility facility);

  @Query("select i from Inspection i where i.report.id = :reportId")
  Optional<Inspection> findByReportId(UUID reportId);

  @Query(
      """
          select i.plannedAppointment
          from Inspection i
          join InspectionRelatedFacility irf on irf.procedure = i
          where irf.facility.objectType.id = :objectTypeId
          and i.plannedAppointment is not null
          and i.phase = de.eshg.inspection.inspection.api.InspectionPhase.NEW
          and i.type = :inspectionType
          """)
  List<InspectionAppointment> findInspectionAppointmentsToUpdate(
      UUID objectTypeId, InspectionType inspectionType);

  @Query(
      """
              select i
              from Inspection i
              join InspectionRelatedFacility irf on irf.procedure = i
              where i.id != :excludedInspectionId
              and irf.centralFileStateId in :centralFileStateIds
              and i.executionAppointment.appointmentStart >= :startTime
              and i.executionAppointment.appointmentEnd < :endTime
              """)
  List<Inspection> findByCentralFileStateIdsAndAppointment(
      List<UUID> centralFileStateIds,
      Instant startTime,
      Instant endTime,
      long excludedInspectionId);

  @Query(
      """
              select i
              from Inspection i
              join InspectionRelatedFacility irf on irf.procedure = i
              where (:importId is null or i.id < :importId)
              and irf.centralFileStateId in :centralFileStateIds
              and i.executionAppointment.appointmentStart >= :startTime
              and i.executionAppointment.appointmentEnd < :endTime
              """)
  List<Inspection> findByCentralFileStateIdsAndAppointmentAndIdIsLessThan(
      List<UUID> centralFileStateIds, Instant startTime, Instant endTime, Long importId);

  @Query(
      """
            select i
            from Inspection i
            join InspectionRelatedFacility irf on irf.procedure = i
            where irf.centralFileStateId in :centralFileStateIds
            """)
  List<Inspection> findByCentralFileStateIds(List<UUID> centralFileStateIds);

  @Query(
      value = "select distinct inspection_id from inspection_possible_duplicates",
      nativeQuery = true)
  List<Long> getInspectionIdsWithDuplicates();

  @Modifying
  @Query(
      value = "delete from inspection_possible_duplicates where duplicate_id = ?1",
      nativeQuery = true)
  void deleteInspectionFromDuplicatesLists(Long duplicateId);
}

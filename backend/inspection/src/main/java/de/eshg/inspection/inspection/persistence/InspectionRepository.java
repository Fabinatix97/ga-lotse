/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
}

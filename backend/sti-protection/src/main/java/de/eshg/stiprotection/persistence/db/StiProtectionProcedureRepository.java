/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface StiProtectionProcedureRepository
    extends ProcedureRepository<StiProtectionProcedure>,
        JpaSpecificationExecutor<StiProtectionProcedure> {
  @Query(
      """
  select sti from StiProtectionProcedure sti where sti.calendarEventId in :calendarEventIds order by sti.calendarEventId
  """)
  List<StiProtectionProcedure> findAllByCalendarEventIdOrderById(Collection<UUID> calendarEventIds);

  List<StiProtectionProcedure> findByCreatedAtBefore(Instant overdueDate);

  Optional<StiProtectionProcedure> findByAnonymousUserId(UUID anonymousUserId);

  @Query(
      """
    SELECT sti FROM StiProtectionProcedure sti
        LEFT JOIN FETCH sti.appointment
        LEFT JOIN FETCH sti.userDefinedAppointment
        WHERE
            (
                sti.appointment.appointmentEnd IS NOT NULL
                OR sti.userDefinedAppointment.appointmentEnd IS NOT NULL
            )
            AND
            COALESCE(sti.appointment.appointmentEnd, sti.userDefinedAppointment.appointmentEnd) <= :overdueDate
    ORDER BY sti.id
    """)
  List<StiProtectionProcedure> findAllAppointmentsWithEndBeforeOrEqual(Instant overdueDate);

  List<StiProtectionProcedure> findByAppointmentIn(List<Appointment> appointments);
}

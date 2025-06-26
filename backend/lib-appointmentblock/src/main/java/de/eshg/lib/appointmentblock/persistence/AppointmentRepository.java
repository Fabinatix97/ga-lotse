/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

  @Query(
      "select a from Appointment a "
          + "where a.appointmentStart <= :start and a.appointmentEnd >= :end "
          + "or a.appointmentStart >= :start and a.appointmentStart <= :end "
          + "or a.appointmentEnd >= :start and a.appointmentEnd <= :end order by a.id")
  List<Appointment> findAppointmentsOverlappingWithTimeRange(
      @Param("start") Instant start, @Param("end") Instant end);
}

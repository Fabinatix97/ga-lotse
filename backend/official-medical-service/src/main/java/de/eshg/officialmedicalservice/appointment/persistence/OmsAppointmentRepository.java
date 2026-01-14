/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.appointment.persistence;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OmsAppointmentRepository extends JpaRepository<OmsAppointment, UUID> {
  List<OmsAppointment> findByAppointmentIn(List<Appointment> appointments);
}

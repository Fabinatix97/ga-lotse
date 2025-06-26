/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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

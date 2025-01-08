/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;

public interface EntityWithAppointment {

  Appointment getAppointment();

  void setAppointment(Appointment appointment);
}

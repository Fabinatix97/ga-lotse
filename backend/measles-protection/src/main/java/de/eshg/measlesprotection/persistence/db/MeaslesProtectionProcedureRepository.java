/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.util.List;

public interface MeaslesProtectionProcedureRepository
    extends ProcedureRepository<MeaslesProtectionProcedure> {
  List<MeaslesProtectionProcedure> findByAppointmentIn(List<Appointment> appointments);
}

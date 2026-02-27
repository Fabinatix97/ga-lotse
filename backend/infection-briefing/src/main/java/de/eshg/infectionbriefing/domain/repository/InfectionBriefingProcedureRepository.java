/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.domain.repository;

import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.util.List;
import java.util.UUID;

public interface InfectionBriefingProcedureRepository
    extends ProcedureRepository<InfectionBriefingProcedure> {

  List<InfectionBriefingProcedure> findByAppointmentIn(List<Appointment> appointments);

  List<InfectionBriefingProcedure> getByCitizenUserId(UUID citizenUserId);
}

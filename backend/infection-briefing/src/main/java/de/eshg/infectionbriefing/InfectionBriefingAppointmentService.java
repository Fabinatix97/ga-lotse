/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class InfectionBriefingAppointmentService
    extends AbstractAppointmentService<InfectionBriefingProcedure> {

  private final Clock clock;

  public InfectionBriefingAppointmentService(Clock clock) {
    this.clock = clock;
  }

  @Override
  protected Clock getClock() {
    return clock;
  }

  @Override
  protected List<InfectionBriefingProcedure> resolveEntitiesWithAppointments(
      List<Appointment> appointments) {
    throw new UnsupportedOperationException("TODO");
  }

  @Override
  protected Map<InfectionBriefingProcedure, String> getInformationForAppointmentOverview(
      List<InfectionBriefingProcedure> entities) {
    throw new UnsupportedOperationException("TODO");
  }

  @Override
  protected UUID getProcedureId(InfectionBriefingProcedure entity) {
    return entity.getExternalId();
  }
}

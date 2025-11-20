/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection;

import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ProstituteProtectionAppointmentService
    extends AbstractAppointmentService<ProstituteProtectionProcedure> {
  private final Clock clock;
  private final ProstituteProtectionProcedureRepository prostituteProtectionProcedureRepository;

  public ProstituteProtectionAppointmentService(
      Clock clock,
      ProstituteProtectionProcedureRepository prostituteProtectionProcedureRepository) {
    this.clock = clock;
    this.prostituteProtectionProcedureRepository = prostituteProtectionProcedureRepository;
  }

  @Override
  public Clock getClock() {
    return clock;
  }

  @Override
  protected List<ProstituteProtectionProcedure> resolveEntitiesWithAppointments(
      List<Appointment> appointments) {
    return List.of();
  }

  @Override
  protected Map<ProstituteProtectionProcedure, String> getInformationForAppointmentOverview(
      List<ProstituteProtectionProcedure> entities) {
    return Map.of();
  }

  @Override
  protected UUID getProcedureId(ProstituteProtectionProcedure entity) {
    return entity.getExternalId();
  }
}

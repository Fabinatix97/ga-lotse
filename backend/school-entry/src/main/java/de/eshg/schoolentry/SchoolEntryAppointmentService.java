/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.schoolentry.business.model.ProcedureWithChildData;
import de.eshg.schoolentry.client.PersonClient;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class SchoolEntryAppointmentService
    extends AbstractAppointmentService<SchoolEntryProcedure> {
  private final Clock clock;
  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final PersonClient personClient;

  public SchoolEntryAppointmentService(
      Clock clock,
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      PersonClient personClient) {
    this.clock = clock;
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.personClient = personClient;
  }

  @Override
  public Clock getClock() {
    return clock;
  }

  @Override
  protected List<SchoolEntryProcedure> resolveEntitiesWithAppointments(
      List<Appointment> appointments) {
    return schoolEntryProcedureRepository.findByAppointmentIn(appointments);
  }

  @Override
  protected Map<SchoolEntryProcedure, String> getInformationForAppointmentOverview(
      List<SchoolEntryProcedure> entities) {
    return personClient
        .augmentWithChildData(entities)
        .collect(
            StreamUtil.toLinkedHashMap(
                ProcedureWithChildData::procedure,
                data ->
                    data.child() == null
                        ? ""
                        : "%s %s".formatted(data.child().firstName(), data.child().lastName())));
  }

  @Override
  protected UUID getProcedureId(SchoolEntryProcedure entity) {
    return entity.getExternalId();
  }
}

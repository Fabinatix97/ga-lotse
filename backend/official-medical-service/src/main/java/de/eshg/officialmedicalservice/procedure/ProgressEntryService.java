/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import java.time.Clock;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ProgressEntryService {

  private final Clock clock;
  private final UserApi userApi;
  private final DateTimeFormatter dateTimeFormatter =
      DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
  private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

  public ProgressEntryService(Clock clock, UserApi userApi) {
    this.clock = clock;
    this.userApi = userApi;
  }

  public void createProgressEntryForUpdateAffectedPerson(
      OmsProcedure procedure, UUID previousFileStateId) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.UPDATE_AFFECTED_PERSON.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    progressEntry.setPreviousFileStateId(previousFileStateId);
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForSyncAffectedPerson(
      OmsProcedure procedure, UUID previousFileStateId) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.SYNC_AFFECTED_PERSON.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    progressEntry.setPreviousFileStateId(previousFileStateId);
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForSyncFacility(OmsProcedure procedure) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.SYNC_FACILITY.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }

  public void createProgressEntryForModifiedPhysician(
      OmsProcedure procedure, UserDto newPhysician) {
    String note =
        "Der Vorgang wurde "
            + newPhysician.firstName()
            + " "
            + newPhysician.lastName()
            + " zugeordnet.";
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            OmsProgressEntryType.PHYSICIAN_CHANGED.name(), note, TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(progressEntry);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.data;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.stiprotection.persistence.db.AppointmentHistoryEntry;
import de.eshg.stiprotection.persistence.db.Concern;
import de.eshg.stiprotection.persistence.db.Person;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.UserDefinedAppointment;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoom;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record StiProtectionProcedureData(StiProtectionProcedure procedure, String accessCode) {
  public UUID id() {
    return procedure.getExternalId();
  }

  public Instant createdAt() {
    return procedure.getCreatedAt();
  }

  public ProcedureStatus status() {
    return procedure.getProcedureStatus();
  }

  public Concern concern() {
    return procedure.getConcern();
  }

  public Boolean isFollowUp() {
    return procedure.isFollowUp();
  }

  public Person person() {
    return procedure.getPerson();
  }

  public Appointment appointment() {
    return procedure.getAppointment();
  }

  public UserDefinedAppointment userDefinedAppointment() {
    return procedure.getUserDefinedAppointment();
  }

  public List<AppointmentHistoryEntry> appointmentHistory() {
    return procedure.getAppointmentHistory();
  }

  public WaitingRoom waitingRoom() {
    return procedure.getWaitingRoom();
  }

  public String sampleBarCode() {
    return procedure.getSampleBarCode();
  }

  public Instant appointmentStart() {
    return procedure.getAppointmentStart();
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.data;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.stiprotection.persistence.db.AppointmentHistoryEntry;
import de.eshg.stiprotection.persistence.db.Concern;
import de.eshg.stiprotection.persistence.db.Person;
import de.eshg.stiprotection.persistence.db.UserDefinedAppointment;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoom;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record StiProtectionProcedureData(
    UUID id,
    Instant createdAt,
    ProcedureStatus status,
    Concern concern,
    Person person,
    Appointment appointment,
    UserDefinedAppointment userDefinedAppointment,
    List<AppointmentHistoryEntry> appointmentHistory,
    WaitingRoom waitingRoom,
    String accessCode) {}

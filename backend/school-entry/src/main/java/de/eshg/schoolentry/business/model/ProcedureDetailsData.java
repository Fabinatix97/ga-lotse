/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.lib.appointmentblock.api.LocationDto;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.api.SchoolDto;
import de.eshg.schoolentry.domain.model.Label;
import de.eshg.schoolentry.domain.model.WaitingRoom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

public record ProcedureDetailsData(
    Long internalId,
    UUID externalId,
    long version,
    ProcedureType type,
    ChildDetailsData child,
    List<CustodianDetailsData> custodians,
    List<Label> labels,
    Appointment appointment,
    SchoolDto school,
    LocationDto location,
    boolean isEntryLevel,
    boolean isInvitationSent,
    boolean isDeceased,
    LocalDate deceased,
    Year schoolYear,
    ProcedureStatus status,
    boolean isDeletable,
    Instant createdAt,
    Instant modifiedAt,
    WaitingRoom waitingRoom) {}

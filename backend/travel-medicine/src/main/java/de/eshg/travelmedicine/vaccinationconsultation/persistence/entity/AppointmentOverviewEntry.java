/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record AppointmentOverviewEntry(
    @NotNull UUID procedureId,
    UUID centralFileStateId,
    LocalDate travelStartDate,
    @NotNull CreatedByUserType createdBy,
    @NotNull ProcedureStatus status,
    Instant userDefinedAppointment,
    Boolean cancelled,
    Instant appointmentBlockAppointment,
    LocalDate earliestDate,
    @NotNull AppointmentType appointmentType) {}

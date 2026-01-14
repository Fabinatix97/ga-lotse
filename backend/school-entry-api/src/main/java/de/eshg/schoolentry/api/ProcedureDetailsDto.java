/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.LocationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(name = "ProcedureDetails")
public record ProcedureDetailsDto(
    @NotNull UUID id,
    @NotNull long version,
    @NotNull ProcedureTypeDto type,
    @NotNull @Valid PersonDetailsDto child,
    @NotNull @Valid List<CustodianDetailsDto> custodians,
    @NotNull @Valid List<ProcedureLabelDto> labels,
    @Valid AppointmentDto appointment,
    @Valid SchoolDto school,
    @Valid LocationDto location,
    @NotNull boolean isEntryLevel,
    @NotNull boolean isInvitationSent,
    @NotNull boolean isDeceased,
    LocalDate deceased,
    @Min(1900) Integer schoolYear,
    @NotNull ProcedureStatusDto status,
    @NotNull boolean isDeletable,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt,
    @NotNull @Valid WaitingRoomDto waitingRoom,
    Instant schoolInfoLetterCreatedAt,
    @NotNull boolean hasInformationBlock,
    @NotNull boolean hasBeenClosed,
    @NotNull boolean isPastProcedure)
    implements ProcedureBaseDto {}

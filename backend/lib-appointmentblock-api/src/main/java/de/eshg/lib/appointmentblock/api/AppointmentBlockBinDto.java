/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(
    name = "AppointmentBlockBin",
    description =
        "A bin represents a single sequence of slots in an appointment block, meaning there are no parallel slots within a bin. Multiple bins can occur within a block.")
public record AppointmentBlockBinDto(
    @Valid @NotNull List<AppointmentBlockSlotDto> appointmentBlockSlots) {}

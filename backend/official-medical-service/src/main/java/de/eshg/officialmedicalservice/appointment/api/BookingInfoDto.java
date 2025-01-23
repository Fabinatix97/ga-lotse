/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Schema(name = "BookingInfo")
public record BookingInfoDto(
    @NotNull BookingTypeDto bookingType, @NotNull Instant start, @NotNull Integer duration) {}

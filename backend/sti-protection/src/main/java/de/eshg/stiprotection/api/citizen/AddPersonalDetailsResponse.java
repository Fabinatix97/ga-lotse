/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import de.eshg.stiprotection.api.ConcernDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.Instant;
import java.time.Year;

public record AddPersonalDetailsResponse(
    @NotNull ConcernDto concern,
    @NotNull Instant appointmentStart,
    @NotNull @Past @Schema(type = "integer") Year yearOfBirth) {}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Year;
import java.util.UUID;

@Schema(name = "Person")
public record PersonDto(
    @NotNull UUID id,
    @NotNull GenderDto gender,
    @Schema(type = "integer") @NotNull Year yearOfBirth,
    CountryCode countryOfBirth,
    @Schema(type = "integer") Year inGermanySince) {}

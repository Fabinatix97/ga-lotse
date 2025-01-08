/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.citizen;

import de.eshg.base.address.DomesticAddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AppointmentAddress")
public record AppointmentAddressDto(
    @NotNull String name, @NotNull @Valid DomesticAddressDto address) {}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.citizen;

import de.eshg.schoolentry.api.SchoolEntryDomesticAddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AppointmentAddress")
public record AppointmentAddressDto(
    @NotNull String name, @NotNull @Valid SchoolEntryDomesticAddressDto address) {}

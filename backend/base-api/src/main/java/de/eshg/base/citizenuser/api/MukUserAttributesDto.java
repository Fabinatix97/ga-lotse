/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.api;

import de.eshg.base.address.DomesticAddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = "MukUserAttributes", description = "The MUK attributes of a user")
public record MukUserAttributesDto(
    @NotBlank String facilityName, @NotNull @Valid DomesticAddressDto address) {}

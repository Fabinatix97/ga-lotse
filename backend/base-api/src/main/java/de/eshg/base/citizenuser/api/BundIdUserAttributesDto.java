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

@Schema(name = "BundIdUserAttributes", description = "The BundId attributes of a user")
public record BundIdUserAttributesDto(
    @NotBlank String firstName,
    @NotBlank String lastName,
    @NotNull @Valid DomesticAddressDto address) {}

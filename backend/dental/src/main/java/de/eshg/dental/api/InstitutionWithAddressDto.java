/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InstitutionWithAddress")
public record InstitutionWithAddressDto(
    @NotNull UUID id,
    @NotNull String name,
    @NotNull String city,
    @NotNull String street,
    String houseNumber) {}

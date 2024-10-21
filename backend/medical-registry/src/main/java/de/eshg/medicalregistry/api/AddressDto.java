/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "MedicalRegistryAddress")
public record AddressDto(
    @NotNull String street,
    @NotNull String houseNumber,
    @NotNull String postalCode,
    @NotNull String city) {}

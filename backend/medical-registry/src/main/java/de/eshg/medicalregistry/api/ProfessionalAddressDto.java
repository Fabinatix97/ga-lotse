/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "ProfessionalAddress")
public record ProfessionalAddressDto(
    @NotNull CountryCode country,
    @NotNull @Size(min = 1, max = 55) String street,
    @NotNull @Size(min = 1, max = 11) String houseNumber,
    @NotNull @Size(min = 1, max = 20) String postalCode,
    @NotNull @Size(min = 1, max = 50) String city) {}

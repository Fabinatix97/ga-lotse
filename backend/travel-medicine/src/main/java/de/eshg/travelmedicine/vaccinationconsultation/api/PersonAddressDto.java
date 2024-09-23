/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.base.CountryCodeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "PersonAddress")
public record PersonAddressDto(
    @NotNull CountryCodeDto country,
    @NotBlank @Size(max = 50) String city,
    @NotBlank String postalCode,
    @NotBlank @Size(max = 55) String street,
    @Size(max = 11) String houseNumber,
    @Size(max = 100) String addressAddition) {}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.api;

import de.eshg.config.initialization.InitialDepartmentInfo;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = "DepartmentInfo")
public record DepartmentInfoDto(
    @NotBlank String name,
    @NotBlank String abbreviation,
    @NotBlank String street,
    @NotBlank String houseNumber,
    @NotBlank String postalCode,
    @NotBlank String city,
    @NotNull CountryCode country,
    @NotBlank String phoneNumber,
    @NotBlank String homepage,
    @NotBlank String email,
    @NotNull Double latitude,
    @NotNull Double longitude)
    implements InitialDepartmentInfo {}

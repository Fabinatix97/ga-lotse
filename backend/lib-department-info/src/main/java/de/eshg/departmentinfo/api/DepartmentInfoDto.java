/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo.api;

import de.eshg.departmentinfo.initialization.InitialDepartmentInfo;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "DepartmentInfo")
public record DepartmentInfoDto(
    @NotNull String name,
    @NotNull String abbreviation,
    @NotNull String street,
    @NotNull String houseNumber,
    @NotNull String postalCode,
    @NotNull String city,
    @NotNull CountryCode country,
    @NotNull String phoneNumber,
    @NotNull String homepage,
    @NotNull String email,
    @NotNull Double latitude,
    @NotNull Double longitude)
    implements InitialDepartmentInfo {}

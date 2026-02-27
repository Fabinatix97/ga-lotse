/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;

@Schema(name = "ApplicantAddress")
public record ApplicantAddressDto(
    @NotEmpty String street,
    String houseNumber,
    @NotEmpty String postalCode,
    @NotEmpty String city) {}

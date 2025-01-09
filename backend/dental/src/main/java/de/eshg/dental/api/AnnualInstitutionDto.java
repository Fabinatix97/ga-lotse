/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "AnnualInstitution")
public record AnnualInstitutionDto(
    @NotNull UUID childId,
    @NotNull @Valid InstitutionDto institution,
    @NotNull int year,
    @NotEmpty String group) {}

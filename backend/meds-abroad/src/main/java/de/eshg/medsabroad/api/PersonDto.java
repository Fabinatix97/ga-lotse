/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

@Schema(name = "Person", description = "A person who is applying for approval.")
public record PersonDto(
    @NotBlank @Schema(description = "First name of the applicant.", example = "Susanne")
        String firstName,
    @NotBlank @Schema(description = "Last name of the applicant.", example = "Gerber")
        String lastName,
    @NotNull @Schema(description = "Date of birth of the applicant.", example = "2018-07-26") @Past
        LocalDate dateOfBirth) {}

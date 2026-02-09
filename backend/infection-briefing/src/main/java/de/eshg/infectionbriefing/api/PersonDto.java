/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.base.SalutationDto;
import de.eshg.validation.constraints.DateOfBirth;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Schema(name = "Person")
public record PersonDto(
    SalutationDto salutation,
    @NotNull
        @Size(min = 1, max = 80)
        @Schema(description = "First name of the applicant.", example = "Susanne")
        String firstName,
    @NotNull
        @Size(min = 1, max = 120)
        @Schema(description = "Last name of the applicant.", example = "Gerber")
        String lastName,
    @NotNull
        @DateOfBirth
        @Schema(description = "Date of birth of the applicant.", example = "2018-07-26")
        @Past
        LocalDate dateOfBirth,
    @NotNull @Size(min = 6, max = 254) @Email String email,
    @Size(min = 1, max = 23) String phone) {}

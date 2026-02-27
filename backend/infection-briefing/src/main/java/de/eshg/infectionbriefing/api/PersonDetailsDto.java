/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.validation.constraints.EmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

@Schema(name = "PersonDetails")
public record PersonDetailsDto(
    InfectionBriefingSalutationDto salutation,
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull LocalDate dateOfBirth,
    List<@EmailAddressConstraint String> email,
    List<@Size(min = 1, max = 23) String> phone,
    @Valid ApplicantAddressDto address) {}

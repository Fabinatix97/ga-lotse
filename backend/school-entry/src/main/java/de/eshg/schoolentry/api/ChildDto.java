/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import de.eshg.base.GenderDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(
    name = "Child",
    description =
        "Child representation. In the context of the school entry examination, the child represents the patient.")
public record ChildDto(
    String firstName, String lastName, LocalDate dateOfBirth, @NotNull GenderDto gender)
    implements PersonBaseDto {}

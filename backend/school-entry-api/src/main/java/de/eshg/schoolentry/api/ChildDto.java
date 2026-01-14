/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(
    name = "Child",
    description =
        "Child representation. In the context of the school entry examination, the child represents the patient.")
public record ChildDto(
    String firstName, String lastName, LocalDate dateOfBirth, @NotNull SchoolEntryGenderDto gender)
    implements PersonBaseDto {}

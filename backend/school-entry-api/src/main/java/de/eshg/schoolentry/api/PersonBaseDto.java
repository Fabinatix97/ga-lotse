/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public interface PersonBaseDto {
  @NotBlank
  @Schema(description = "First name of the person.", example = "Hermione")
  String firstName();

  @NotBlank
  @Schema(description = "Last name of the person.", example = "Granger")
  String lastName();

  @NotNull
  @Schema(description = "Date of birth of the person.", example = "2024-02-01")
  LocalDate dateOfBirth();

  SchoolEntryGenderDto gender();
}

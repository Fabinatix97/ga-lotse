/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.citizen;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;

public record GetCitizenProcedureResponse(
    @NotNull Instant appointmentStart,
    @NotNull Instant appointmentEnd,
    @NotNull @Valid AppointmentAddressDto appointmentAddress,
    @NotNull @Valid GetCitizenProcedureResponse.CitizenChildDto child,
    @NotNull Boolean allowCitizenAnamnesis,
    @NotNull @Min(0) @Max(2) Integer appointmentChangesByCitizenLeft,
    @NotNull Boolean isClosedProcedure) {

  @Schema(name = "CitizenChild", description = "Get procedure information of child.")
  public record CitizenChildDto(
      @NotBlank String firstName, @NotBlank String lastName, @NotNull LocalDate dateOfBirth) {}
}

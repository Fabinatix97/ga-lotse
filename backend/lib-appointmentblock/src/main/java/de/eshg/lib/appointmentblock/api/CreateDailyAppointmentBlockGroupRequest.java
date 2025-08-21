/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record CreateDailyAppointmentBlockGroupRequest(
    @NotNull @Size(min = 1) List<AppointmentTypeDto> types,
    @NotNull @Min(1) @Max(10) int parallelExaminations,
    @Valid @NotNull @NotEmpty List<CreateDailyAppointmentBlockDto> appointmentBlocks,
    List<UUID> physicians,
    List<UUID> mfas,
    List<UUID> consultants,
    UUID locationId,
    Boolean availableForCitizen,
    Boolean availableForBulkBooking) {

  public CreateDailyAppointmentBlockGroupRequest(
      List<AppointmentTypeDto> types,
      int parallelExaminations,
      List<CreateDailyAppointmentBlockDto> appointmentBlocks,
      List<UUID> physicians,
      List<UUID> mfas,
      List<UUID> consultants) {
    this(
        types,
        parallelExaminations,
        appointmentBlocks,
        physicians,
        mfas,
        consultants,
        null,
        null,
        null);
  }
}

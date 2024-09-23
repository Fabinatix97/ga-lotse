/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CreateAppointmentBlockGroupRequest(
    @NotNull AppointmentTypeDto type,
    @NotNull @Min(1) @Max(10) int parallelExaminations,
    @Valid @NotNull @NotEmpty List<CreateAppointmentBlockDto> appointmentBlocks,
    List<UUID> physicians,
    List<UUID> mfas,
    List<UUID> consultants,
    UUID locationId) {

  public CreateAppointmentBlockGroupRequest(
      AppointmentTypeDto type,
      int parallelExaminations,
      Instant start,
      Instant end,
      List<UUID> physicians,
      List<UUID> mfas,
      List<UUID> consultants,
      UUID locationId) {
    this(
        type,
        parallelExaminations,
        List.of(new CreateAppointmentBlockDto(start, end)),
        physicians,
        mfas,
        consultants,
        locationId);
  }

  public CreateAppointmentBlockGroupRequest(
      AppointmentTypeDto type,
      int parallelExaminations,
      Instant start,
      Instant end,
      List<UUID> physicians,
      List<UUID> mfas,
      List<UUID> consultants) {
    this(type, parallelExaminations, start, end, physicians, mfas, consultants, null);
  }
}

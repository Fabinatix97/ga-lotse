/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record GetCitizenAppointmentResponse(
    @Valid AppointmentSummaryDto openAppointment,
    @NotBlank String lastName,
    @NotBlank String firstName,
    @NotNull LocalDate dateOfBirth) {}

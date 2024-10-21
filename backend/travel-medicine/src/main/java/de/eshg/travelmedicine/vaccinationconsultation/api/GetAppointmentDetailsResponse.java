/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record GetAppointmentDetailsResponse(
    @NotNull @Valid AppointmentSummaryDto summaryDto,
    @NotNull boolean hasAccomplishedService,
    @NotNull int bookingsRemaining,
    @NotBlank String lastName,
    @NotBlank String firstName,
    @NotNull LocalDate dateOfBirth,
    @NotNull boolean isMedicalHistoryCompletelyAnswered,
    @NotNull boolean citizenHasAnswered) {}

/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record GetAppointmentDetailsResponse(
    @NotNull @Valid AppointmentSummaryDto summaryDto,
    @NotNull boolean hasAccomplishedService,
    @NotBlank String lastName,
    @NotBlank String firstName,
    @NotNull LocalDate dateOfBirth,
    UUID medicalHistoryId,
    @NotNull boolean isMedicalHistoryAnswered) {}

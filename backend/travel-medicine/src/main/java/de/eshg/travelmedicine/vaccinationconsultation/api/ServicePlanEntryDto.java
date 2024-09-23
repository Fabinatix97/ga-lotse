/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "ServicePlanEntry")
public record ServicePlanEntryDto(
    @NotNull UUID serviceId,
    @NotNull String serviceTypeDescription,
    String diseaseName,
    String vaccineName,
    @Min(1) Integer vaccinationNumber,
    Integer latency,
    String batchIdentifier,
    LocalDate appliedAt,
    UUID physician,
    UUID mfa,
    @NotNull ServiceStatusDto status,
    UUID procedureStepId,
    Instant appointment,
    AppointmentTypeDto appointmentType,
    AppointmentBookingTypeDto appointmentBookingType,
    LocalDate earliestDate,
    @NotNull BigDecimal fee,
    Boolean medicalHistoryCompleted) {}

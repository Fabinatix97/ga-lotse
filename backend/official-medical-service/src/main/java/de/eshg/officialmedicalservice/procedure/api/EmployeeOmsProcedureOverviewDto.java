/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "EmployeeOmsProcedureOverview")
public record EmployeeOmsProcedureOverviewDto(
    @NotNull UUID id,
    @NotNull ProcedureStatusDto status,
    @NotNull MedicalOpinionStatusDto medicalOpinionStatus,
    String firstName,
    String lastName,
    LocalDate dateOfBirth,
    String facilityName,
    @Valid ConcernDto concern,
    String physicianName,
    Instant nextAppointment,
    LocalDate medicalOpinionCutOffDate) {}

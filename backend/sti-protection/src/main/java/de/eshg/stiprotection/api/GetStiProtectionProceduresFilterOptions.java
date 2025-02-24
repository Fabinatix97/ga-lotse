/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;
import java.time.Year;
import java.util.Set;
import org.springframework.web.bind.annotation.BindParam;

public record GetStiProtectionProceduresFilterOptions(
    @BindParam("creationDateStart") @Parameter LocalDate creationDateStart,
    @BindParam("creationDateEnd") @Parameter LocalDate creationDateEnd,
    @BindParam("yearOfBirth") @Parameter @Schema(type = "integer") @Past Year yearOfBirth,
    @BindParam("appointmentDateStart") @Parameter LocalDate appointmentDateStart,
    @BindParam("appointmentDateEnd") @Parameter LocalDate appointmentDateEnd,
    @BindParam("gender") @Parameter Set<GenderDto> gender,
    @BindParam("concern") @Parameter Set<ConcernDto> concern,
    @BindParam("procedureStatus") @Parameter Set<ProcedureStatusDto> procedureStatus,
    @BindParam("labStatus") @Parameter Set<LabStatusDto> labStatus,
    @BindParam("createdBy") @Parameter Set<CreatedByUserTypeDto> createdBy) {}

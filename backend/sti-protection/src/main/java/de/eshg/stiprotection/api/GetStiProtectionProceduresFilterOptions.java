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
    @Schema(description = "Start of the procedure creation date.")
        @BindParam("creationDateStart")
        @Parameter
        LocalDate creationDateStart,
    @Schema(description = "End of the procedure creation date.")
        @BindParam("creationDateEnd")
        @Parameter
        LocalDate creationDateEnd,
    @BindParam("yearOfBirth")
        @Parameter
        @Schema(type = "integer", description = "Indicates the year of birth of the person.")
        @Past
        Year yearOfBirth,
    @Schema(description = "Start date of the appointment.")
        @BindParam("appointmentDateStart")
        @Parameter
        LocalDate appointmentDateStart,
    @Schema(description = "End date of the appointment.")
        @BindParam("appointmentDateEnd")
        @Parameter
        LocalDate appointmentDateEnd,
    @Schema(description = "Sex of the person.") @BindParam("gender") @Parameter
        Set<GenderDto> gender,
    @Schema(description = "Indicates the specific context or reason for the procedure.")
        @BindParam("concern")
        @Parameter
        Set<ConcernDto> concern,
    @Schema(description = "The current status of the procedure.")
        @BindParam("procedureStatus")
        @Parameter
        Set<ProcedureStatusDto> procedureStatus,
    @Schema(description = "The current status of the laboratory tests.")
        @BindParam("labStatus")
        @Parameter
        Set<LabStatusDto> labStatus,
    @Schema(description = "The origin where the procedure was initially created.")
        @BindParam("procedureOrigin")
        @Parameter
        Set<StiProcedureOriginDto> procedureOrigin) {}

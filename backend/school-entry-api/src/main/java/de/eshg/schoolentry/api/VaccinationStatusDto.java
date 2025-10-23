/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Schema(name = "VaccinationStatus")
public record VaccinationStatusDto(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    VaccinationSchemeValueDto vaccinationScheme,
    @Min(0) @Max(9) @Schema(description = "Number of diphtheria vaccinations.") Integer diphtheria,
    @Min(0) @Max(9) @Schema(description = "Number of tetanus vaccinations.") Integer tetanus,
    @Min(0) @Max(9) @Schema(description = "Number of pertussis vaccinations.") Integer pertussis,
    @Min(0) @Max(9) @Schema(description = "Number of hib vaccinations.") Integer hib,
    @Min(0) @Max(9) @Schema(description = "Number of polio vaccinations.") Integer polio,
    @Min(0) @Max(9) @Schema(description = "Number of hepatitisB vaccinations.") Integer hepatitisB,
    @Min(0) @Max(9) @Schema(description = "Number of pneumococcus vaccinations.")
        Integer pneumococcus,
    @Min(0) @Max(9) @Schema(description = "Number of mmr vaccinations.") Integer mmr,
    @Min(0) @Max(9) @Schema(description = "Number of varicella vaccinations.") Integer varicella,
    @Min(0) @Max(9) @Schema(description = "Number of meningococcusB vaccinations.")
        Integer meningococcusB,
    @Min(0) @Max(9) @Schema(description = "Number of meningococcusC vaccinations.")
        Integer meningococcusC,
    @Min(0) @Max(9) @Schema(description = "Number of rota vaccinations.") Integer rota,
    @Min(0) @Max(9) @Schema(description = "Number of tbe vaccinations.") Integer tbe,
    @Min(0) @Max(9) @Schema(description = "Number of hepatitisA vaccinations.") Integer hepatitisA,
    @Valid @NotNull @Schema(description = "List of additional vaccinations.")
        List<OtherVaccinationDto> otherVaccinations,
    @Schema(description = "Boolean that indicates, if the vaccination pass was shown or not.")
        Boolean vaccinationPassPresented,
    BooleanWithUnknownDto perkombiHbv,
    Boolean measlesContraIndication,
    Boolean measlesContraIndicationIsPermanent,
    LocalDate measlesContraIndicationUntil,
    String note) {}

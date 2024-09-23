/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "VaccinationConsultationSearch")
public record VaccinationConsultationSearchDto(
    @NotNull UUID procedureId,
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull LocalDate dateOfBirth,
    LocalDate travelStartDate,
    @NotNull ProcedureStatusDto status,
    @NotNull CreatedByUserTypeDto createdBy) {}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(name = "Child")
public record ChildDto(
    @NotNull UUID id,
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull GenderDto gender,
    @NotNull LocalDate dateOfBirth,
    @NotNull int year,
    String groupName,
    @NotNull @Valid InstitutionDto institution,
    @NotNull ProcedureStatusDto status,
    @NotNull @Valid List<ProcedureLabelDto> procedureLabels) {}

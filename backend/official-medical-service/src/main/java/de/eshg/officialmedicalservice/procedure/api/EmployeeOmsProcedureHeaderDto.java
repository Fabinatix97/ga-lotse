/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "EmployeeOmsProcedureHeader")
public record EmployeeOmsProcedureHeaderDto(
    @NotNull UUID id,
    @NotNull ProcedureStatusDto status,
    String firstName,
    String lastName,
    LocalDate dateOfBirth) {}

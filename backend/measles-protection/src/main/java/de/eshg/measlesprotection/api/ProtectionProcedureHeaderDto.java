/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(name = "ProtectionProcedureHeader")
public record ProtectionProcedureHeaderDto(
    @NotBlank String firstName, @NotBlank String lastName, @NotNull LocalDate dateOfBirth) {}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import de.eshg.base.gdpr.api.GdprIdentificationDataDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "GdprValidationTask")
public record GdprValidationTaskDto(
    @NotNull UUID gdprProcedureId,
    @NotNull GdprValidationTaskStatusDto status,
    @NotNull LocalDate dueDate,
    @Valid @NotNull GdprIdentificationDataDto identificationData,
    @NotNull GdprValidationTaskTypeDto type) {}

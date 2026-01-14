/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetGdprValidationTaskDetailsResponse(
    @Valid @NotNull GdprValidationTaskDto validationTask,
    @Valid @NotNull List<BusinessProcedureWithInclusionStatusDto> proceduresWithStatus) {}

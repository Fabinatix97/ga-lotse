/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import de.eshg.base.PagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetAllValidationTasksResponse(
    @Valid @NotNull List<GdprValidationTaskDto> elements,
    @NotNull @Min(0) long totalNumberOfElements)
    implements PagedResponse<GdprValidationTaskDto> {}

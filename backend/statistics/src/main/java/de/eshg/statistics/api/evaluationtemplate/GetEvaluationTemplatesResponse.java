/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import de.eshg.base.user.api.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetEvaluationTemplatesResponse(
    @NotNull @Valid List<EvaluationTemplateInfoDto> evaluationTemplates,
    @NotNull @Valid Map<UUID, UserDto> resolvedUsers,
    @NotNull @Min(0) long totalNumberOfElements) {}

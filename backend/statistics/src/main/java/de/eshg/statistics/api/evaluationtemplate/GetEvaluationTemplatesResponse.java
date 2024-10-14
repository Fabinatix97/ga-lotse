/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetEvaluationTemplatesResponse(
    @NotNull @Valid List<EvaluationTemplateDto> evaluationTemplates) {}

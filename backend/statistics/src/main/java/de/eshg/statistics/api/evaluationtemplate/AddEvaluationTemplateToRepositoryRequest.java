/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AddEvaluationTemplateToRepositoryRequest(
    @NotNull UUID templateId, String changelog, String contact) {}

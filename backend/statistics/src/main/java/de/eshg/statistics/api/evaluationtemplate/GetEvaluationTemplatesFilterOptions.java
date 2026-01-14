/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import de.eshg.statistics.api.DateSpan;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

public record GetEvaluationTemplatesFilterOptions(
    String name, List<UUID> dataSourceIds, @Valid DateSpan createdAt) {}

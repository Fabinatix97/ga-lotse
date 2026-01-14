/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluation;

import de.eshg.statistics.api.DateSpan;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

public record GetEvaluationsFilterOptions(
    List<EvaluationDataSensitivity> dataSensitivities,
    String name,
    List<EvaluationStateDto> states,
    List<UUID> dataSourceIds,
    @Valid DateSpan start,
    @Valid DateSpan end) {}

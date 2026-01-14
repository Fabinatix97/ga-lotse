/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import de.eshg.lib.statistics.api.DataSourceSensitivity;
import jakarta.validation.constraints.NotNull;

public record TemplateSensitivityInfo(
    @NotNull boolean sensitiveDataAllowed,
    DataSourceSensitivity sensitivity,
    @NotNull boolean canBeAnonymized) {}

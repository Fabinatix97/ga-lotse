/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics.api;

import de.eshg.lib.statistics.api.SubjectType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record BaseAvailableDataSource(
    @NotNull SubjectType subjectType, @NotNull @Valid List<BaseAttribute> attributes) {}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "TClosenessHierarchyEntry")
public record TClosenessHierarchyEntryDto(List<String> hierarchySteps) {}

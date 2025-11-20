/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.Min;
import java.util.List;
import java.util.UUID;

public record ChildFilterParameters(
    @Min(1900) Integer yearFilter,
    UUID institutionIdFilter,
    String groupNameFilter,
    Boolean noGroupFilter,
    List<UUID> procedureLabelsFilter,
    List<UUID> excludedProcedureLabelsFilter,
    BooleanWithUnknownDto fluoridationConsentFilter) {}

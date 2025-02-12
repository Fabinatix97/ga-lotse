/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import jakarta.validation.constraints.NotNull;

public record TextTemplatePopulationRequest(@NotNull Integer numberOfEntitiesToPopulate) {}

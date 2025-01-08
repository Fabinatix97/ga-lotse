/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.api;

import jakarta.validation.constraints.NotNull;

public record PopulationRequest(@NotNull int numberOfEntitiesToPopulate) {}

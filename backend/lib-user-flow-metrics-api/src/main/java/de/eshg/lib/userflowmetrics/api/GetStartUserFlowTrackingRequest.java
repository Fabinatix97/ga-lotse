/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.api;

import jakarta.validation.constraints.NotNull;

public record GetStartUserFlowTrackingRequest(@NotNull UserFlowTypeDto userFlowType) {}

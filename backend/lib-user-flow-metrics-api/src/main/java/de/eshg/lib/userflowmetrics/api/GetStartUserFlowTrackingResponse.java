/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record GetStartUserFlowTrackingResponse(@NotNull UUID userFlowTrackingId) {}

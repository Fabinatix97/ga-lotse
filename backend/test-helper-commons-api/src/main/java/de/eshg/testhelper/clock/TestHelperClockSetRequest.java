/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.clock;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record TestHelperClockSetRequest(@NotNull Instant newInstant) {}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.clock;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record TestHelperClockUpdateResponse(@NotNull Instant instant) {}

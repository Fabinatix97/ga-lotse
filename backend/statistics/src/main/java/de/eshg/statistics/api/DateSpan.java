/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import java.time.Instant;

public record DateSpan(Instant lowerBoundary, Instant upperBoundary) {}

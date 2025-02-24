/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization.interval;

public record Interval<T extends Number>(T minInclusive, T maxExclusive) {}

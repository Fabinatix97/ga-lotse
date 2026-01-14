/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization;

public record Interval<T extends Number>(T minInclusive, T maxExclusive) {}

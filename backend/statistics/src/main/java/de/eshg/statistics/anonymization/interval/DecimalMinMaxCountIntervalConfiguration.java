/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization.interval;

import java.math.BigDecimal;

public record DecimalMinMaxCountIntervalConfiguration(
    BigDecimal minInclusive, BigDecimal maxInclusive, int countIntervals)
    implements DecimalIntervalConfiguration {}

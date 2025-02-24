/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization.interval;

import java.math.BigDecimal;
import java.util.List;

public record DecimalIntervalBordersConfiguration(List<BigDecimal> intervalBorders)
    implements DecimalIntervalConfiguration {}

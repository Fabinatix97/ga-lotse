/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization.interval;

import java.util.List;

public record IntegerIntervalBordersConfiguration(List<Integer> intervalBorders)
    implements IntegerIntervalConfiguration {}

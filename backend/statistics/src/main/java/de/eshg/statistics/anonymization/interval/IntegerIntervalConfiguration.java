/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization.interval;

public sealed interface IntegerIntervalConfiguration
    permits CountIntervalConfiguration,
        IntegerMinMaxCountIntervalConfiguration,
        IntegerIntervalBordersConfiguration {}

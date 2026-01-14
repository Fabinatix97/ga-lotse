/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization;

import java.util.Map;
import java.util.UUID;
import org.deidentifier.arx.ARXConfiguration;
import org.deidentifier.arx.Data;

public record DataHolderBeforeAnonymization(
    UUID id,
    boolean isReport,
    ARXConfiguration config,
    Data.DefaultData data,
    Map<String, Interval<Number>> tableColumnSearchKeyToMinMaxInterval) {}

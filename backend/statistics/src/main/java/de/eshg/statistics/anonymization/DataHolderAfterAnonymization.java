/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization;

import java.util.Map;
import java.util.UUID;
import org.deidentifier.arx.DataHandle;

public record DataHolderAfterAnonymization(
    UUID id, boolean isReport, DataHandle dataHandle, Map<Long, Integer> rowIdToRowIndex) {}

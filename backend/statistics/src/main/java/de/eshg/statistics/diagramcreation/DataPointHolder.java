/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.diagramcreation;

import java.math.BigDecimal;

public record DataPointHolder(
    Long rowId, BigDecimal xCoordinate, BigDecimal yCoordinate, String secondaryKey) {}

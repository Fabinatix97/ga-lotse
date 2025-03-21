/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.export;

import org.apache.poi.ss.usermodel.CellStyle;

public record CellStyleHolder(CellStyle cellStyleString, CellStyle cellStyleNumeric) {}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.base.SortDirection;

public record ProcedurePageSpec(
    int pageNumber, int pageSize, ProcedureSortKey sortKey, SortDirection direction) {}

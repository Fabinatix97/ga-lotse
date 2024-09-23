/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.schoolentry.util.ProcedureSortKey;
import org.springframework.data.domain.Sort;

public record ProcedurePageSpec(
    int pageNumber, int pageSize, ProcedureSortKey sortKey, Sort.Direction direction) {}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.util;

import de.eshg.api.commons.SortDirection;
import de.eshg.dental.api.ChildSortKey;

public record ChildPageSpec(
    int pageNumber, int pageSize, ChildSortKey sortKey, SortDirection direction) {}

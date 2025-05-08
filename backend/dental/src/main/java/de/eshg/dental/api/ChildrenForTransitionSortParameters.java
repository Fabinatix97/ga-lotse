/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.base.SortDirection;
import de.eshg.base.SortParameters;

public record ChildrenForTransitionSortParameters(
    ChildForTransitionSortKey sortKey, SortDirection sortDirection)
    implements SortParameters<ChildForTransitionSortKey> {}

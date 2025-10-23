/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.api.commons.SortDirection;
import de.eshg.api.commons.SortParameters;

public record ChildrenForTransitionSortParameters(
    ChildForTransitionSortKey sortKey, SortDirection sortDirection)
    implements SortParameters<ChildForTransitionSortKey> {}

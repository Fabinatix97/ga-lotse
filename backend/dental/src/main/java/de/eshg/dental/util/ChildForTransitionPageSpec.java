/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.util;

import de.eshg.api.commons.SortDirection;
import de.eshg.dental.api.ChildForTransitionSortKey;

public record ChildForTransitionPageSpec(
    ChildForTransitionSortKey sortKey, SortDirection direction) {}

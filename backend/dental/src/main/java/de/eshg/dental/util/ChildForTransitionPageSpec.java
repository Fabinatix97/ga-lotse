/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.util;

import de.eshg.api.commons.SortDirection;
import de.eshg.dental.api.ChildForTransitionSortKey;

public record ChildForTransitionPageSpec(
    ChildForTransitionSortKey sortKey, SortDirection direction) {}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.base.SortDirection;

public record WaitingRoomPageSpec(
    int pageNumber, int pageSize, WaitingRoomSortKey sortKey, SortDirection direction) {}

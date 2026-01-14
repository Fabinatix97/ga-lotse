/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.SortDirection;
import de.eshg.prostituteprotection.api.WaitingRoomSortKey;

public record WaitingRoomPageSpec(
    int pageNumber, int pageSize, WaitingRoomSortKey sortKey, SortDirection direction) {}

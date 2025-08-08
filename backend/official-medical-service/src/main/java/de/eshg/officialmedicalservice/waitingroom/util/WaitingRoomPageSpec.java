/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.waitingroom.util;

import de.eshg.base.SortDirection;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey;

public record WaitingRoomPageSpec(
    int pageNumber, int pageSize, WaitingRoomSortKey sortKey, SortDirection direction) {}

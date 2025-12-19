/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.waitingroom.util;

import de.eshg.api.commons.SortDirection;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey;

public record WaitingRoomPageSpec(
    int pageNumber, int pageSize, WaitingRoomSortKey sortKey, SortDirection direction) {}

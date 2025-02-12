/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.waitingroom.util;

import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey;
import org.springframework.data.domain.Sort;

public record WaitingRoomPageSpec(
    int pageNumber, int pageSize, WaitingRoomSortKey sortKey, Sort.Direction direction) {}

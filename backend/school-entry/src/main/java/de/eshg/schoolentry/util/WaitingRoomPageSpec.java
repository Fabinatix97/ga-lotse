/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import org.springframework.data.domain.Sort;

public record WaitingRoomPageSpec(
    int pageNumber, int pageSize, WaitingRoomSortKey sortKey, Sort.Direction direction) {}

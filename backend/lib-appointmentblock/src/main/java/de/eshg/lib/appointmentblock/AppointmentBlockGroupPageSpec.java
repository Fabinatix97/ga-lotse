/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.base.SortDirection;
import de.eshg.lib.appointmentblock.api.AppointmentBlockSortKey;

public record AppointmentBlockGroupPageSpec(
    int pageNumber, int pageSize, AppointmentBlockSortKey sortKey, SortDirection direction) {}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.api.AppointmentBlockSortKey;
import org.springframework.data.domain.Sort;

public record AppointmentBlockGroupPageSpec(
    int pageNumber, int pageSize, AppointmentBlockSortKey sortKey, Sort.Direction direction) {}

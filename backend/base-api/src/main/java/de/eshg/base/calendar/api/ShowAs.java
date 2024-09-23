/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    description =
        """
            - FREE shows the timeslot of an event as available
            - BUSY shows the timeslot of an event as unavailable. Events can still be booked at BUSY timeslots
            - BUSY is the default value
        """)
public enum ShowAs {
  BUSY,
  FREE
}

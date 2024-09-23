/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record DetailedEventWithoutCalendarId(
    @NotNull UUID id,
    @NotNull EventTypeDto type,
    @NotNull ShowAs showAs,
    UUID lastModifiedByUserId,
    @Valid @NotNull EventMetaData metaData,
    @Valid @NotNull EventTimeData timeData)
    implements AugmentableEvent<DetailedEventWithoutCalendarId> {

  @Override
  public DetailedEventWithoutCalendarId copyWithMetadata(EventMetaData metaData) {
    return new DetailedEventWithoutCalendarId(
        this.id, this.type, this.showAs, this.lastModifiedByUserId, metaData, this.timeData);
  }
}

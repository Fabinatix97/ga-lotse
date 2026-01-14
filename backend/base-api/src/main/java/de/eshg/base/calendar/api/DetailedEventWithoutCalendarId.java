/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record DetailedEventWithoutCalendarId(
    @NotNull UUID id,
    @NotNull EventTypeDto type,
    UUID lastModifiedByUserId,
    @Valid @NotNull EventMetaData metaData,
    @Valid @NotNull EventTimeData timeData)
    implements AugmentableEvent<DetailedEventWithoutCalendarId> {

  @Override
  public DetailedEventWithoutCalendarId copyWithMetadata(EventMetaData metaData) {
    return new DetailedEventWithoutCalendarId(
        this.id, this.type, this.lastModifiedByUserId, metaData, this.timeData);
  }
}

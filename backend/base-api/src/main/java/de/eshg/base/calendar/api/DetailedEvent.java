/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record DetailedEvent(
    @NotNull UUID id,
    @NotNull @Size(min = 1) List<UUID> calendarIds,
    @Valid @NotNull List<UserCalendar> userCalenders,
    @Valid @NotNull List<ResourceCalendar> resourceCalendars,
    @NotNull EventTypeDto type,
    UUID lastModifiedByUserId,
    @Valid @NotNull EventMetaData metaData,
    @Valid @NotNull EventTimeData timeData)
    implements AugmentableEvent<DetailedEvent> {

  @Override
  public DetailedEvent copyWithMetadata(EventMetaData metaData) {
    return new DetailedEvent(
        this.id,
        this.calendarIds,
        this.userCalenders,
        this.resourceCalendars,
        this.type,
        this.lastModifiedByUserId,
        metaData,
        this.timeData);
  }
}

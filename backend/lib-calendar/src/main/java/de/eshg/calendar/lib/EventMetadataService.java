/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.calendar.lib;

import de.eshg.calendar.lib.api.EventWithMetaData;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

public interface EventMetadataService {
  Stream<EventWithMetaData> findByCalendarEventIds(List<UUID> eventIds);
}

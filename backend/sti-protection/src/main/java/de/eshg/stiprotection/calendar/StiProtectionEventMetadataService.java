/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.calendar;

import de.eshg.calendar.lib.EventMetadataService;
import de.eshg.calendar.lib.api.EventWithMetaData;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.stereotype.Service;

@Service
public class StiProtectionEventMetadataService implements EventMetadataService {

  @Override
  public Stream<EventWithMetaData> findByCalendarEventIds(List<UUID> eventIds) {
    throw new NotImplementedException();
  }
}

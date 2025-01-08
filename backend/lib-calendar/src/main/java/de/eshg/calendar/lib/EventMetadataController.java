/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.calendar.lib;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.calendar.lib.api.EventWithMetaData;
import de.eshg.calendar.lib.api.GetMetadataOfEventsRequest;
import de.eshg.calendar.lib.api.GetMetadataOfEventsResponse;
import de.eshg.lib.common.BusinessModule;
import io.swagger.v3.oas.annotations.Hidden;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@Hidden
@RestController
public class EventMetadataController implements EventMetadataApi {

  private final EventMetadataService eventMetadataService;
  private final BusinessModule businessModule;

  public EventMetadataController(
      EventMetadataService eventMetadataService, BusinessModule businessModule) {
    this.eventMetadataService = eventMetadataService;
    this.businessModule = businessModule;
  }

  @Override
  @Transactional(readOnly = true)
  public GetMetadataOfEventsResponse getMetadataForEvents(GetMetadataOfEventsRequest request) {
    Map<UUID, EventWithMetaData> eventMetadataByEventId =
        eventMetadataService
            .findByCalendarEventIds(request.eventIds())
            .collect(StreamUtil.toLinkedHashMap(EventWithMetaData::eventId));

    List<EventWithMetaData> existingEventsWithMetaData = new ArrayList<>();
    List<UUID> notFoundEventIds = new ArrayList<>();

    // Note: We return events in the very same order as requested
    for (UUID eventId : request.eventIds()) {
      EventWithMetaData eventWithMetaData = eventMetadataByEventId.get(eventId);
      if (eventWithMetaData != null) {
        existingEventsWithMetaData.add(eventWithMetaData);
      } else {
        notFoundEventIds.add(eventId);
      }
    }

    return new GetMetadataOfEventsResponse(
        businessModule, existingEventsWithMetaData, notFoundEventIds);
  }
}

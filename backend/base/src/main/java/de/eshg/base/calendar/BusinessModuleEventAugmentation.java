/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar;

import static de.eshg.lib.aggregation.BusinessModuleAggregationHelper.*;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.calendar.api.AugmentableEvent;
import de.eshg.base.calendar.api.EventMetaData;
import de.eshg.base.calendar.api.EventTypeDto;
import de.eshg.calendar.lib.api.GetMetadataOfEventsRequest;
import de.eshg.calendar.lib.api.GetMetadataOfEventsResponse;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.common.BusinessModuleCapability;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.BiFunction;
import org.springframework.stereotype.Component;

@Component
public class BusinessModuleEventAugmentation {

  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;

  public BusinessModuleEventAugmentation(
      BusinessModuleAggregationHelper businessModuleAggregationHelper) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
  }

  public <R, E extends AugmentableEvent<E>> R augmentBusinessModuleEventsWithMetadata(
      BiFunction<List<E>, List<ErrorResponseWithLocation>, R> responseCreationFunction,
      List<E> events) {
    Map<UUID, E> idToEventMap =
        events.stream()
            .filter(event -> event.type().equals(EventTypeDto.BUSINESS_CASE))
            .collect(StreamUtil.toLinkedHashMap(AugmentableEvent::id));

    if (idToEventMap.isEmpty()) {
      return responseCreationFunction.apply(events, Collections.emptyList());
    }

    List<ClientResponse<GetMetadataOfEventsResponse>> extractedBusinessModuleResponses =
        businessModuleAggregationHelper.requestFromBusinessModules(
            null,
            BusinessModuleCapability.CALENDAR,
            client ->
                client.getMetadataForEvents(
                    new GetMetadataOfEventsRequest(new ArrayList<>(idToEventMap.keySet()))));

    extractedBusinessModuleResponses.stream()
        .map(ClientResponse::response)
        .filter(Objects::nonNull)
        .forEach(
            getMetadataOfEventsResponse ->
                addMetaDataToEvents(getMetadataOfEventsResponse, idToEventMap));

    List<E> augmentedEvents =
        events.stream().map(event -> idToEventMap.getOrDefault(event.id(), event)).toList();
    return responseCreationFunction.apply(
        augmentedEvents, aggregateErrorResponses(extractedBusinessModuleResponses));
  }

  private <E extends AugmentableEvent<E>> void addMetaDataToEvents(
      GetMetadataOfEventsResponse getMetadataOfEventsResponse, Map<UUID, E> idToEventMap) {
    getMetadataOfEventsResponse
        .existingEventsWithMetaData()
        .forEach(
            eventWithMetaData ->
                idToEventMap.put(
                    eventWithMetaData.eventId(),
                    idToEventMap
                        .get(eventWithMetaData.eventId())
                        .copyWithMetadata(
                            new EventMetaData(
                                eventWithMetaData.subject(),
                                eventWithMetaData.description(),
                                eventWithMetaData.location(),
                                eventWithMetaData.procedureId(),
                                getMetadataOfEventsResponse.businessModule()))));
  }
}

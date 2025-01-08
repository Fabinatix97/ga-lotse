/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.calendar.lib;

import de.eshg.calendar.lib.api.GetMetadataOfEventsRequest;
import de.eshg.calendar.lib.api.GetMetadataOfEventsResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(EventMetadataApi.BASE_URL)
public interface EventMetadataApi {

  String BASE_URL = BaseUrls.EVENT_METADATA_API;

  @PostExchange("/bulk-get")
  @ApiResponse(
      responseCode = "200",
      description =
          "Returned in case of success even when no event is known, unknown ids are also returned")
  @Operation(summary = "Get the event metadata of a possibly known event ids")
  GetMetadataOfEventsResponse getMetadataForEvents(
      @Valid @RequestBody GetMetadataOfEventsRequest getMetadataOfEventsRequest);
}

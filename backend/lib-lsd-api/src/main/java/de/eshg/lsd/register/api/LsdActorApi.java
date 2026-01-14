/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(value = LsdActorApi.BASE_URL)
public interface LsdActorApi {
  String BASE_URL = "/actor";
  String ANNOUNCE_ACTOR_URL = "/announce";
  String HEARTBEAT_ACTOR_URL = "/heartbeat";

  @Operation(
      summary = "Announce an actor by updating its certificate",
      description =
          "Only after an actor was provided with a valid certificate, the requirements to communicate with other actors are fulfilled.")
  @PutExchange(value = ANNOUNCE_ACTOR_URL, accept = MediaType.APPLICATION_JSON_VALUE)
  @ApiResponse(responseCode = "200", description = "Returns the announced actor")
  void announceActor(@Valid @RequestBody AnnounceRequest request);

  @Operation(summary = "Inform LSD that actor is still alive")
  @PostExchange(value = HEARTBEAT_ACTOR_URL)
  @ApiResponse(responseCode = "200", description = "Returns the announced actor")
  void heartbeat(@RequestParam("location") String location);
}

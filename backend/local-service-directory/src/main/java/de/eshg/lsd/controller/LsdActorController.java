/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.controller;

import de.eshg.lsd.register.api.ActorDto;
import de.eshg.lsd.register.api.AnnounceRequest;
import de.eshg.lsd.register.api.LsdActorApi;
import de.eshg.lsd.service.ActorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "LsdActor")
public class LsdActorController implements LsdActorApi {

  private final ActorService actorService;

  public LsdActorController(ActorService actorService) {
    this.actorService = actorService;
  }

  @Override
  public ActorDto announceActor(AnnounceRequest request) {
    String userName = SecurityContextHolder.getContext().getAuthentication().getName();

    var response =
        actorService.updateActor(
            request.type(), request.certificate(), userName, request.readableName());
    actorService.updateTopology();
    return response;
  }
}

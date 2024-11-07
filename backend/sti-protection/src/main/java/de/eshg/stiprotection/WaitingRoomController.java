/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.waitingroom.GetWaitingRoomProceduresResponse;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomDto;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomProcedurePaginationAndSortParameters;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = WaitingRoomController.BASE_URL)
@Tag(name = "WaitingRoom")
public class WaitingRoomController {
  public static final String BASE_URL = BaseUrls.StiProtection.PROCEDURE_CONTROLLER;

  private final WaitingRoomService waitingRoomService;

  public WaitingRoomController(WaitingRoomService waitingRoomService) {
    this.waitingRoomService = waitingRoomService;
  }

  @PutMapping("/{procedureId}/waiting-room")
  @Operation(summary = "Update waiting room details for a procedure.")
  @Transactional
  public WaitingRoomDto updateWaitingRoomDetails(
      @PathVariable("procedureId") UUID procedureId, @Valid @RequestBody WaitingRoomDto request) {
    return waitingRoomService.updateWaitingRoomDetails(procedureId, request);
  }

  @GetMapping("/waiting-room-procedures")
  @Operation(summary = "Get waiting rooms.")
  @Transactional
  public GetWaitingRoomProceduresResponse getWaitingRoomProcedures(
      @InlineParameterObject @ParameterObject @Valid
          WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {
    return waitingRoomService.getWaitingRoomProcedures(paginationAndSortParameters);
  }
}

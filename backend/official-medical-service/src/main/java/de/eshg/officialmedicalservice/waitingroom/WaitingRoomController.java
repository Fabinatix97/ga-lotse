/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.waitingroom;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.officialmedicalservice.waitingroom.api.GetWaitingRoomProceduresResponse;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomProcedurePaginationAndSortParameters;
import de.eshg.rest.service.security.config.BaseUrls.OfficialMedicalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = WaitingRoomController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "WaitingRoom")
public class WaitingRoomController {
  public static final String BASE_URL = OfficialMedicalService.EMPLOYEE_API;
  public static final String WAITING_ROOM_URL = "/waiting-room";

  private final WaitingRoomService waitingRoomService;

  public WaitingRoomController(WaitingRoomService waitingRoomService) {
    this.waitingRoomService = waitingRoomService;
  }

  @GetMapping(path = WAITING_ROOM_URL)
  @Operation(summary = "Get all procedures in waiting room.")
  public GetWaitingRoomProceduresResponse getWaitingRoomProcedures(
      @InlineParameterObject @ParameterObject @Valid
          WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {

    PagedWaitingRoomProcedures pagedProcedures =
        waitingRoomService.getWaitingRoomProcedures(paginationAndSortParameters);

    return new GetWaitingRoomProceduresResponse(
        pagedProcedures.proceduresPage(), pagedProcedures.totalNumberOfProcedures());
  }
}

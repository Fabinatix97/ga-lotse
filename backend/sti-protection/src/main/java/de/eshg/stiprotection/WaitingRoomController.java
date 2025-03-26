/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.waitingroom.GetWaitingRoomProceduresResponse;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomDto;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomProcedureDto;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomProcedurePaginationAndSortParameters;
import de.eshg.stiprotection.mapper.waitingroom.WaitingRoomMapper;
import de.eshg.stiprotection.mapper.waitingroom.WaitingRoomProcedureMapper;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoom;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
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

  @GetMapping("/waiting-room-procedures")
  @Operation(summary = "Get waiting rooms.")
  @Transactional(readOnly = true)
  public GetWaitingRoomProceduresResponse getWaitingRoomProcedures(
      @InlineParameterObject @ParameterObject @Valid
          WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {
    Page<StiProtectionProcedure> procedures =
        waitingRoomService.getWaitingRoomProcedures(paginationAndSortParameters);
    List<WaitingRoomProcedureDto> waitingRoomData =
        procedures.stream().map(WaitingRoomProcedureMapper::toInterface).toList();
    return new GetWaitingRoomProceduresResponse(waitingRoomData, procedures.getNumberOfElements());
  }

  @PutMapping("/{procedureId}/waiting-room")
  @Operation(summary = "Update waiting room details for a procedure.")
  @Transactional
  public void updateWaitingRoomDetails(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody WaitingRoomDto waitingRoomDto) {
    WaitingRoom waitingRoom = waitingRoomService.getOrCreateWaitingRoom(procedureId);
    WaitingRoomMapper.update(waitingRoomDto, waitingRoom);
  }
}

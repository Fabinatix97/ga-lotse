/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.mapper;

import de.eshg.api.commons.SortDirection;
import de.eshg.prostituteprotection.WaitingRoomPageSpec;
import de.eshg.prostituteprotection.api.WaitingRoomDto;
import de.eshg.prostituteprotection.api.WaitingRoomProcedureDto;
import de.eshg.prostituteprotection.api.WaitingRoomSortKey;
import de.eshg.prostituteprotection.api.WaitingStatusDto;
import de.eshg.prostituteprotection.domain.data.WaitingRoomProcedureData;
import de.eshg.prostituteprotection.domain.model.WaitingRoom;
import de.eshg.prostituteprotection.domain.model.WaitingStatus;

public class WaitingRoomMapper {
  private WaitingRoomMapper() {}

  public static WaitingRoomDto mapWaitingRoomToDto(WaitingRoom waitingRoom) {
    return new WaitingRoomDto(
        waitingRoom.getVersion(),
        waitingRoom.getDescription(),
        mapWaitingStatusToDto(waitingRoom.getStatus()));
  }

  public static WaitingStatusDto mapWaitingStatusToDto(WaitingStatus status) {
    return switch (status) {
      case null -> null;
      case WAITING -> WaitingStatusDto.WAITING;
      case IN_CONSULTATION -> WaitingStatusDto.IN_CONSULTATION;
      case DONE -> WaitingStatusDto.DONE;
    };
  }

  public static WaitingRoom mapWaitingRoomToDomain(WaitingRoomDto dto) {
    WaitingRoom waitingRoom = new WaitingRoom();
    waitingRoom.setDescription(dto.description());
    waitingRoom.setStatus(mapWaitingStatusToDomain(dto.status()));
    return waitingRoom;
  }

  public static WaitingStatus mapWaitingStatusToDomain(WaitingStatusDto status) {
    return switch (status) {
      case null -> null;
      case WAITING -> WaitingStatus.WAITING;
      case IN_CONSULTATION -> WaitingStatus.IN_CONSULTATION;
      case DONE -> WaitingStatus.DONE;
    };
  }

  public static WaitingRoomProcedureDto mapWaitingRoomProcedureToDto(
      WaitingRoomProcedureData waitingRoomProcedureData) {
    return new WaitingRoomProcedureDto(
        waitingRoomProcedureData.externalId(),
        waitingRoomProcedureData.alias(),
        mapWaitingRoomToDto(waitingRoomProcedureData.waitingRoom()),
        waitingRoomProcedureData.modifiedAt());
  }

  public static WaitingRoomPageSpec mapToPageSpec(
      int pageNumber, int pageSize, WaitingRoomSortKey sortKey, SortDirection sortDirection) {
    return new WaitingRoomPageSpec(pageNumber, pageSize, sortKey, sortDirection);
  }
}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.waitingroom;

import de.eshg.api.commons.SortDirection;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomDto;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingStatusDto;
import de.eshg.officialmedicalservice.waitingroom.persistence.entity.WaitingRoom;
import de.eshg.officialmedicalservice.waitingroom.persistence.entity.WaitingStatus;
import de.eshg.officialmedicalservice.waitingroom.util.WaitingRoomPageSpec;

public class WaitingRoomMapper {

  private WaitingRoomMapper() {}

  public static WaitingRoomDto mapToDto(WaitingRoom waitingRoom) {
    if (waitingRoom == null) {
      return null;
    }

    return new WaitingRoomDto(waitingRoom.getInfo(), mapStatusToDto(waitingRoom.getStatus()));
  }

  private static WaitingStatusDto mapStatusToDto(WaitingStatus waitingStatus) {
    return switch (waitingStatus) {
      case null -> null;
      case WAITING_FOR_CONSULTATION -> WaitingStatusDto.WAITING_FOR_CONSULTATION;
      case IN_CONSULTATION -> WaitingStatusDto.IN_CONSULTATION;
      case DONE -> WaitingStatusDto.DONE;
    };
  }

  public static WaitingStatus mapStatusFromDto(WaitingStatusDto waitingStatus) {
    return switch (waitingStatus) {
      case null -> null;
      case WAITING_FOR_CONSULTATION -> WaitingStatus.WAITING_FOR_CONSULTATION;
      case IN_CONSULTATION -> WaitingStatus.IN_CONSULTATION;
      case DONE -> WaitingStatus.DONE;
    };
  }

  public static WaitingRoomPageSpec mapToPageSpec(
      int page, int pageSize, WaitingRoomSortKey sortField, SortDirection direction) {
    return new WaitingRoomPageSpec(page, pageSize, sortField, direction);
  }
}

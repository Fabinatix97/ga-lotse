/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.waitingroom;

import de.eshg.base.SortDirection;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomDto;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoom;
import org.springframework.data.domain.Sort;

public class WaitingRoomMapper {
  private WaitingRoomMapper() {}

  public static WaitingRoomDto toInterfaceType(WaitingRoom waitingRoom) {
    if (waitingRoom == null) {
      return null;
    }

    return new WaitingRoomDto(
        waitingRoom.getInfo(), WaitingStatusMapper.toInterfaceType(waitingRoom.getStatus()));
  }

  public static WaitingRoom update(WaitingRoomDto dto, WaitingRoom entity) {
    entity.setInfo(dto.info());
    entity.setStatus(WaitingStatusMapper.toDatabaseType(dto.status()));
    return entity;
  }

  public static Sort.Direction toDatabaseType(SortDirection sortDirection) {
    return switch (sortDirection) {
      case ASC -> Sort.Direction.ASC;
      case DESC -> Sort.Direction.DESC;
    };
  }
}

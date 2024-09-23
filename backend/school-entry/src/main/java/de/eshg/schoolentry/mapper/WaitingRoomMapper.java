/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.WaitingRoomDto;
import de.eshg.schoolentry.api.WaitingStatusDto;
import de.eshg.schoolentry.domain.model.WaitingRoom;
import de.eshg.schoolentry.domain.model.WaitingStatus;

public final class WaitingRoomMapper {
  private WaitingRoomMapper() {}

  public static WaitingRoomDto mapToDto(WaitingRoom waitingRoom) {
    if (waitingRoom == null) {
      return null;
    }

    return new WaitingRoomDto(
        waitingRoom.getVersion(),
        waitingRoom.getDescription(),
        mapStatusToDto(waitingRoom.getStatus()));
  }

  private static WaitingStatusDto mapStatusToDto(WaitingStatus waitingStatus) {
    return switch (waitingStatus) {
      case null -> null;
      case WAITING -> WaitingStatusDto.WAITING;
      case WAITING_FOR_DOCTOR -> WaitingStatusDto.WAITING_FOR_DOCTOR;
      case WAITING_FOR_MFA -> WaitingStatusDto.WAITING_FOR_MFA;
      case IN_EXAMINATION -> WaitingStatusDto.IN_EXAMINATION;
      case IN_EXAMINATION_DOCTOR -> WaitingStatusDto.IN_EXAMINATION_DOCTOR;
      case IN_EXAMINATION_MFA -> WaitingStatusDto.IN_EXAMINATION_MFA;
      case DONE -> WaitingStatusDto.DONE;
      case CANCELLED -> WaitingStatusDto.CANCELLED;
    };
  }

  public static WaitingRoom mapToDomain(WaitingRoomDto dto) {
    if (dto == null) {
      return null;
    }

    WaitingRoom waitingRoom = new WaitingRoom();
    waitingRoom.setDescription(dto.description());
    waitingRoom.setStatus(mapStatusToDomain(dto.status()));
    return waitingRoom;
  }

  private static WaitingStatus mapStatusToDomain(WaitingStatusDto waitingStatus) {
    return switch (waitingStatus) {
      case null -> null;
      case WAITING -> WaitingStatus.WAITING;
      case WAITING_FOR_DOCTOR -> WaitingStatus.WAITING_FOR_DOCTOR;
      case WAITING_FOR_MFA -> WaitingStatus.WAITING_FOR_MFA;
      case IN_EXAMINATION -> WaitingStatus.IN_EXAMINATION;
      case IN_EXAMINATION_DOCTOR -> WaitingStatus.IN_EXAMINATION_DOCTOR;
      case IN_EXAMINATION_MFA -> WaitingStatus.IN_EXAMINATION_MFA;
      case DONE -> WaitingStatus.DONE;
      case CANCELLED -> WaitingStatus.CANCELLED;
    };
  }
}

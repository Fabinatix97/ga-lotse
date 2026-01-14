/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.api.commons.SortDirection;
import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.business.model.WaitingRoomProcedureData;
import de.eshg.schoolentry.domain.model.WaitingRoom;
import de.eshg.schoolentry.domain.model.WaitingStatus;
import de.eshg.schoolentry.util.WaitingRoomPageSpec;

public final class WaitingRoomMapper {
  private WaitingRoomMapper() {}

  public static WaitingRoomProcedureDto mapWaitingRoomProcedureToDto(
      WaitingRoomProcedureData procedureData) {
    if (procedureData == null) {
      return null;
    }

    return new WaitingRoomProcedureDto(
        procedureData.externalId(),
        PersonMapper.mapChildToDto(procedureData.child()),
        mapToDto(procedureData.waitingRoom()),
        procedureData.modifiedAt());
  }

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
      case IN_EXAMINATION_SOPASS -> WaitingStatusDto.IN_EXAMINATION_SOPASS;
      case EXAMINATION_FINISHED -> WaitingStatusDto.EXAMINATION_FINISHED;
      case DONE -> WaitingStatusDto.DONE;
      case CANCELLED -> WaitingStatusDto.CANCELLED;
      case NOT_APPEARED -> WaitingStatusDto.NOT_APPEARED;
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
      case IN_EXAMINATION_SOPASS -> WaitingStatus.IN_EXAMINATION_SOPASS;
      case EXAMINATION_FINISHED -> WaitingStatus.EXAMINATION_FINISHED;
      case DONE -> WaitingStatus.DONE;
      case CANCELLED -> WaitingStatus.CANCELLED;
      case NOT_APPEARED -> WaitingStatus.NOT_APPEARED;
    };
  }

  public static WaitingRoomPageSpec mapToPageSpec(
      int page, int pageSize, WaitingRoomSortKey sortField, SortDirection direction) {
    return new WaitingRoomPageSpec(
        page, pageSize, mapSortField(sortField), direction == null ? SortDirection.ASC : direction);
  }

  private static de.eshg.schoolentry.util.WaitingRoomSortKey mapSortField(
      WaitingRoomSortKey sortKey) {
    return switch (sortKey) {
      case null -> de.eshg.schoolentry.util.WaitingRoomSortKey.ID;
      case ID -> de.eshg.schoolentry.util.WaitingRoomSortKey.ID;
      case DATE_OF_BIRTH -> de.eshg.schoolentry.util.WaitingRoomSortKey.DATE_OF_BIRTH;
      case FIRSTNAME -> de.eshg.schoolentry.util.WaitingRoomSortKey.FIRSTNAME;
      case LASTNAME -> de.eshg.schoolentry.util.WaitingRoomSortKey.LASTNAME;
      case INFO -> de.eshg.schoolentry.util.WaitingRoomSortKey.INFO;
      case STATUS -> de.eshg.schoolentry.util.WaitingRoomSortKey.STATUS;
      case MODIFIED_AT -> de.eshg.schoolentry.util.WaitingRoomSortKey.MODIFIED_AT;
    };
  }
}

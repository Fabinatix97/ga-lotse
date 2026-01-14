/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.waitingroom;

import de.eshg.stiprotection.api.waitingroom.WaitingStatusDto;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingStatus;

public class WaitingStatusMapper {

  private WaitingStatusMapper() {}

  public static WaitingStatusDto toInterfaceType(WaitingStatus entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case WAITING_FOR_CONSULTATION -> WaitingStatusDto.WAITING_FOR_CONSULTATION;
      case WAITING_FOR_RESULTS_REVIEW -> WaitingStatusDto.WAITING_FOR_RESULTS_REVIEW;
      case WAITING_FOR_TESTS -> WaitingStatusDto.WAITING_FOR_TESTS;
      case IN_CONSULTATION -> WaitingStatusDto.IN_CONSULTATION;
      case IN_TESTING -> WaitingStatusDto.IN_TESTING;
      case CANCELLED -> WaitingStatusDto.CANCELLED;
      case DONE -> WaitingStatusDto.DONE;
    };
  }

  public static WaitingStatus toDatabaseType(WaitingStatusDto dto) {
    if (dto == null) {
      return null;
    }

    return switch (dto) {
      case WAITING_FOR_CONSULTATION -> WaitingStatus.WAITING_FOR_CONSULTATION;
      case WAITING_FOR_RESULTS_REVIEW -> WaitingStatus.WAITING_FOR_RESULTS_REVIEW;
      case WAITING_FOR_TESTS -> WaitingStatus.WAITING_FOR_TESTS;
      case IN_CONSULTATION -> WaitingStatus.IN_CONSULTATION;
      case IN_TESTING -> WaitingStatus.IN_TESTING;
      case CANCELLED -> WaitingStatus.CANCELLED;
      case DONE -> WaitingStatus.DONE;
    };
  }
}

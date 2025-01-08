/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.waitingroom;

import de.eshg.stiprotection.api.waitingroom.WaitingRoomProcedureDto;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;

public class WaitingRoomProcedureMapper {
  private WaitingRoomProcedureMapper() {}

  public static WaitingRoomProcedureDto toInterface(
      StiProtectionProcedure procedure, String accessCode) {
    return new WaitingRoomProcedureDto(
        procedure.getExternalId(),
        accessCode,
        procedure.getPerson().getYearOfBirth(),
        procedure.getPerson().getGender(),
        WaitingRoomMapper.toInterfaceType(procedure.getWaitingRoom()),
        procedure.getWaitingRoom().getModifiedAt());
  }
}

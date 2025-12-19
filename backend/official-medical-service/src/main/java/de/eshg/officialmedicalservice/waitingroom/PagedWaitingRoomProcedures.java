/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.waitingroom;

import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomProcedureDto;
import java.util.List;
import java.util.stream.Stream;

public record PagedWaitingRoomProcedures(
    List<WaitingRoomProcedureDto> proceduresPage, long totalNumberOfProcedures) {
  public Stream<WaitingRoomProcedureDto> stream() {
    return proceduresPage.stream();
  }
}

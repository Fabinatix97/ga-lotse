/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.prostituteprotection.domain.data.WaitingRoomProcedureData;
import java.util.List;
import java.util.stream.Stream;

public record PagedWaitingRoomProcedures(
    List<WaitingRoomProcedureData> proceduresPage, long totalNumberOfProcedures) {
  public Stream<WaitingRoomProcedureData> stream() {
    return proceduresPage.stream();
  }
}

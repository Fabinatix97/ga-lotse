/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.schoolentry.business.model.WaitingRoomProcedureData;
import java.util.List;
import java.util.stream.Stream;

record PagedWaitingRoomProcedures(
    List<WaitingRoomProcedureData> proceduresPage, long totalNumberOfProcedures) {
  public Stream<WaitingRoomProcedureData> stream() {
    return proceduresPage.stream();
  }
}

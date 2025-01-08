/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import java.util.List;
import java.util.stream.Stream;

public record PagedWaitingRoomProcedures(
    List<WaitingRoomProcedureData> proceduresPage, long totalNumberOfProcedures) {
  public Stream<WaitingRoomProcedureData> stream() {
    return proceduresPage.stream();
  }
}

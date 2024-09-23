/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.schoolentry.business.model.ProcedureData;
import java.util.List;
import java.util.stream.Stream;

record PagedProcedures(List<ProcedureData> proceduresPage, long totalNumberOfProcedures) {
  public Stream<ProcedureData> stream() {
    return proceduresPage.stream();
  }
}

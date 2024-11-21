/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import java.util.List;
import java.util.stream.Stream;

public record PagedProcedures(List<ProcedureData> proceduresPage, long totalNumberOfProcedures) {
  public Stream<ProcedureData> stream() {
    return proceduresPage.stream();
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.util;

import de.eshg.lib.statistics.api.DataRow;
import java.util.Collections;
import java.util.List;

public record DataRowPage(List<DataRow> dataRows, long totalNumberOfElements) {

  public static DataRowPage empty() {
    return new DataRowPage(Collections.emptyList(), 0);
  }
}

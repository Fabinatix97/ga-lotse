/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv.opencsv;

import java.io.Serial;
import java.util.Arrays;
import org.apache.commons.collections4.comparators.FixedOrderComparator;

public class OpenCsvFixedOrderComparator extends FixedOrderComparator<String> {
  @Serial private static final long serialVersionUID = 1L;

  public OpenCsvFixedOrderComparator(String... items) {
    super(Arrays.stream(items).map(String::toUpperCase).toList());
  }
}

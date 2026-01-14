/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest;

import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;
import java.util.stream.Collectors;

public class RestHelper {
  public static String queryTemplate(Collection<String> queryKeys) {
    return queryTemplate(queryKeys.toArray(new String[0]));
  }

  public static String queryTemplate(String... queryVariables) {
    return Arrays.stream(queryVariables)
        .filter(Objects::nonNull)
        .map(q -> String.format("%1$s={%1$s}", q))
        .collect(Collectors.joining("&", "?", ""));
  }
}

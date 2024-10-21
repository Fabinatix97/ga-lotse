/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.util;

import de.cronn.commons.lang.StreamUtil;
import java.util.List;

public final class MapperUtils {
  public MapperUtils() {}

  public static String singleElementOrNull(List<String> items) {
    return items.stream().collect(StreamUtil.toSingleOptionalElement()).orElse(null);
  }
}

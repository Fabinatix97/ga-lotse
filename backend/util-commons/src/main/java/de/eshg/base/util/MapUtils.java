/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.SequencedMap;

public final class MapUtils {
  private MapUtils() {}

  public static <K, V> SequencedMap<K, V> orderedMapOf(K k1, V v1) {
    return orderedMapOfEntries(Map.entry(k1, v1));
  }

  public static <K, V> SequencedMap<K, V> orderedMapOf(K k1, V v1, K k2, V v2) {
    return orderedMapOfEntries(Map.entry(k1, v1), Map.entry(k2, v2));
  }

  @SafeVarargs
  public static <K, V> SequencedMap<K, V> orderedMapOfEntries(Map.Entry<K, V>... entries) {
    SequencedMap<K, V> sequencedMap = new LinkedHashMap<>();
    for (Map.Entry<K, V> entry : entries) {
      sequencedMap.put(entry.getKey(), entry.getValue());
    }
    return Collections.unmodifiableSequencedMap(sequencedMap);
  }
}

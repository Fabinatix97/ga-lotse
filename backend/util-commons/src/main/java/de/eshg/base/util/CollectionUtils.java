/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import com.google.common.collect.Sets;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class CollectionUtils {
  private CollectionUtils() {}

  public static <T> List<T> listUnion(List<List<? extends T>> lists) {
    return lists.stream().flatMap(Collection::stream).collect(Collectors.toUnmodifiableList());
  }

  public static <T> List<T> arrayUnion(List<T[]> arrays) {
    return arrays.stream().flatMap(Arrays::stream).toList();
  }

  public static <T> Set<T> difference(Set<T> set1, Set<T> set2) {
    return Sets.difference(set1, set2);
  }

  public static <T> List<T> difference(List<T> list1, List<T> list2) {
    return List.copyOf(Sets.difference(Set.copyOf(list1), Set.copyOf(list2)));
  }

  public static <T> Set<T> union(Set<T> set1, Set<T> set2) {
    return Sets.union(set1, set2);
  }

  public static <T> List<T> union(List<T> list1, List<T> list2) {
    return List.copyOf(Sets.union(Set.copyOf(list1), Set.copyOf(list2)));
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import java.util.List;
import java.util.function.BiPredicate;

public final class MatcherUtil {

  private MatcherUtil() {}

  static <T> boolean isListEqualUnordered(List<T> a, List<T> b, BiPredicate<T, T> isEqual) {
    return a.size() == b.size()
        && a.stream()
            .allMatch(
                elementA -> b.stream().anyMatch(elementB -> isEqual.test(elementA, elementB)));
  }
}

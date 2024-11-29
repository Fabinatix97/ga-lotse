/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure;

import java.util.*;
import java.util.function.BinaryOperator;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.UnaryOperator;
import java.util.stream.Collector;

public class MapperHelper {
  private MapperHelper() {}

  public static <D extends Enum<D>, I extends Enum<I>> Set<D> mapEnumSet(
      Set<I> input, Function<I, D> mapper) {
    if (input == null) {
      return null; // NOSONAR null is mapped to null
    }

    return input.stream().map(mapper).collect(toEnumSet());
  }

  public static <T extends Enum<T>> Collector<T, Set<T>, Set<T>> toEnumSet() {
    BinaryOperator<Set<T>> combiner =
        (firstSet, secondSet) -> {
          firstSet.addAll(secondSet);
          return firstSet;
        };

    UnaryOperator<Set<T>> finisher =
        set -> {
          if (set.isEmpty()) {
            return Collections.emptySet();
          } else {
            return EnumSet.copyOf(set);
          }
        };

    return Collector.of(LinkedHashSet::new, Collection::add, combiner, finisher);
  }

  public static <T, M> Consumer<T> mapAndSet(Function<T, M> mapper, Consumer<M> setter) {
    return value -> setter.accept(mapper.apply(value));
  }

  public static List<String> toList(String value) {
    return value == null ? List.of() : List.of(value);
  }
}

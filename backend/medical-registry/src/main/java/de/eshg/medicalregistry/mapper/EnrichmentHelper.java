/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.mapper;

import static java.util.Optional.ofNullable;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Stream;

public class EnrichmentHelper {

  public static <T, E> T enrich(Function<E, T> getter, E newState, E oldState) {
    return ofNullable(getter.apply(newState)).orElse(getter.apply(oldState));
  }

  public static <T, E> List<T> enrichList(Function<E, List<T>> getter, E newState, E oldState) {
    return Stream.of(getter.apply(newState), getter.apply(oldState))
        .flatMap(Collection::stream)
        .distinct()
        .toList();
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import java.util.List;
import java.util.stream.Collectors;

abstract class AbstractSearchableStringFormatter<T> {

  protected abstract Class<T> getClazz();

  protected abstract List<TypedPropertyFormatter<T, ?>> getPropertyFormatters();

  public String formatAsSearchable(T obj) {
    return getPropertyFormatters().stream()
        .map(formatter -> formatter.format(obj))
        .collect(Collectors.joining(" "));
  }

  String formatListOfStringsByConcatenation(List<String> strings) {
    return strings.stream().map(Object::toString).collect(Collectors.joining(" "));
  }
}

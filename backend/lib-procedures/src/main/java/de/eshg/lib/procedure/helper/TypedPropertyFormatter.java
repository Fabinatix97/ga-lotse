/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import de.cronn.reflection.util.TypedPropertyGetter;
import java.util.function.Function;

public class TypedPropertyFormatter<T, U> {

  private final TypedPropertyGetter<T, U> typedPropertyGetter;
  private final Function<U, String> formatter;

  public TypedPropertyFormatter(
      TypedPropertyGetter<T, U> typedPropertyGetter, Function<U, String> formatter) {
    this.typedPropertyGetter = typedPropertyGetter;
    this.formatter = formatter;
  }

  public TypedPropertyGetter<T, U> getTypedPropertyGetter() {
    return typedPropertyGetter;
  }

  public String format(T object) {
    U value = typedPropertyGetter.get(object);

    if (value == null) {
      return "";
    }

    return formatter.apply(value);
  }
}

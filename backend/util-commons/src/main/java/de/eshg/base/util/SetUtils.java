/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import java.util.Collections;
import java.util.LinkedHashSet;

public final class SetUtils {

  private SetUtils() {}

  public static <E> LinkedHashSet<E> of(E e) {
    return new LinkedHashSet<>(Collections.singletonList(e));
  }
}

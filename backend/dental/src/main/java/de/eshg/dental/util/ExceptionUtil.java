/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.util;

import de.eshg.rest.service.error.NotFoundException;

public final class ExceptionUtil {
  private ExceptionUtil() {}

  public static NotFoundException notFoundException(Class<?> clazz) {
    return new NotFoundException("%s with given UUID not found".formatted(clazz.getSimpleName()));
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.util;

import de.eshg.rest.service.error.NotFoundException;

public final class ExceptionUtil {
  private ExceptionUtil() {}

  public static NotFoundException notFoundException(Class<?> clazz) {
    return new NotFoundException("%s with given UUID not found".formatted(clazz.getSimpleName()));
  }
}

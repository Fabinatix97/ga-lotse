/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.util;

import de.eshg.dental.domain.model.Child;
import de.eshg.rest.service.error.NotFoundException;
import java.util.UUID;
import java.util.function.Supplier;

public final class ExceptionUtil {
  private ExceptionUtil() {}

  public static Supplier<NotFoundException> notFoundException(Class<?> clazz, UUID id) {
    return () ->
        new NotFoundException("%s with UUID %s not found".formatted(clazz.getSimpleName(), id));
  }

  public static Supplier<NotFoundException> childNotFoundException(UUID procedureId) {
    return notFoundException(Child.class, procedureId);
  }
}

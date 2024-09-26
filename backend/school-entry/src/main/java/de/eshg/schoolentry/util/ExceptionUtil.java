/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.UUID;
import java.util.function.Supplier;

public final class ExceptionUtil {
  private ExceptionUtil() {}

  public static Supplier<NotFoundException> notFoundException(Class<?> clazz, UUID id) {
    return () ->
        new NotFoundException("%s with UUID %s not found".formatted(clazz.getSimpleName(), id));
  }

  public static BadRequestException badRequestExceptionForbiddenLocationId() {
    return new BadRequestException(
        "Location id must not be provided unless location selection mode is %s"
            .formatted(LocationSelectionMode.HEALTH_DEPARTMENT));
  }

  public static BadRequestException badRequestExceptionMissingLocationId() {
    return new BadRequestException(
        "Location id is mandatory when location selection mode is %s"
            .formatted(LocationSelectionMode.HEALTH_DEPARTMENT));
  }

  public static BadRequestException badRequestExceptionUnsupportedLocationMode() {
    return new BadRequestException("Unsupported location mode");
  }
}

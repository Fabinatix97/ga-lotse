/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;

public final class ExceptionUtil {
  private ExceptionUtil() {}

  public static NotFoundException notFoundException(Class<?> clazz) {
    return new NotFoundException("%s with given UUID not found".formatted(clazz.getSimpleName()));
  }

  public static NotFoundException procedureNotFoundException() {
    return notFoundException(SchoolEntryProcedure.class);
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

  public static IllegalStateException mergeNotSupportedForPastProcedureImport() {
    return new IllegalStateException("Merge is not supported for past procedure import.");
  }
}

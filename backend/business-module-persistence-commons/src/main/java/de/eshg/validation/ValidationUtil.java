/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.validation;

import de.eshg.domain.model.GenericEntity;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.util.Objects;

public final class ValidationUtil {

  private ValidationUtil() {}

  public static <E extends GenericEntity<?>> void validateVersion(
      long versionInUpdateRequest, E persistentEntity) {
    Long persistentVersion =
        Objects.requireNonNull(
            persistentEntity.getVersion(),
            () -> "Version of " + persistentEntity + " must not be null");
    validateVersion(versionInUpdateRequest, persistentVersion);
  }

  private static void validateVersion(long versionInUpdateRequest, long persistentVersion) {
    if (versionInUpdateRequest != persistentVersion) {
      String clientVisibleMessage =
          "Given version " + versionInUpdateRequest + " does not match the version in persistence";
      String internalMessage =
          "Persistent version: %d, given version: %d"
              .formatted(persistentVersion, versionInUpdateRequest);
      throw new BadRequestException(ErrorCode.CONFLICT, clientVisibleMessage, internalMessage);
    }
  }
}

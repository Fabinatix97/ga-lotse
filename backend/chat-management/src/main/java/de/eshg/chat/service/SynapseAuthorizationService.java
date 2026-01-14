/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.service;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class SynapseAuthorizationService {

  public void validateIfMxidBelongsToCurrentUser(String matrixUserId) {
    String keycloakUserIdFromMXID = extractMXIDLocalpart(matrixUserId);
    validateIfUserIdBelongsToCurrentUser(keycloakUserIdFromMXID);
  }

  public void validateIfUserIdBelongsToCurrentUser(String userId) {
    String actualKeycloakUserId = CurrentUserHelper.getCurrentUserId().toString();
    if (!actualKeycloakUserId.equals(userId)) {
      throw new BadRequestException(
          String.format(
              "Provided ID `%s` is not matching logged-in user ID `%s`.",
              userId, actualKeycloakUserId));
    }
  }

  public static String extractMXIDLocalpart(String matrixUserId) {
    Matcher matcher = Pattern.compile("^@([^:@]+):(.+)$").matcher(matrixUserId);
    if (!matcher.matches()) {
      throw new BadRequestException(
          String.format("Provided MXID `%s` must match format `@localpart:server`.", matrixUserId));
    }
    return matcher.group(1);
  }
}

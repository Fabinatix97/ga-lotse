/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.mappers;

import de.eshg.keycloak.api.user.model.KeycloakApiUserDto;
import java.util.UUID;
import org.keycloak.representations.idm.UserRepresentation;

public class KeycloakMapper {
  public static KeycloakApiUserDto mapUserToApi(UserRepresentation user) {
    return new KeycloakApiUserDto(
        UUID.fromString(user.getId()),
        user.getUsername(),
        user.getEmail(),
        user.getFirstName(),
        user.getLastName(),
        user.isEnabled(),
        user.getAttributes());
  }
}

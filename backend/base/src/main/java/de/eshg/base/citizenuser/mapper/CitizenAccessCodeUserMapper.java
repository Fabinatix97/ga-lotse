/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.mapper;

import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.util.KeycloakUtil;
import de.eshg.keycloak.api.user.KeycloakAttributes;
import de.eshg.keycloak.api.user.model.CredentialTypeDto;
import java.util.*;
import org.keycloak.representations.idm.UserRepresentation;

public final class CitizenAccessCodeUserMapper {

  private CitizenAccessCodeUserMapper() {
    // static mapper
  }

  public static CitizenAccessCodeUserDto mapUserToApi(UserRepresentation user) {
    String accessCode =
        KeycloakUtil.getUserAttribute(
                user.getAttributes(), KeycloakAttributes.ACCESS_CODE_ATTRIBUTE)
            .orElseThrow();
    return new CitizenAccessCodeUserDto(UUID.fromString(user.getId()), accessCode);
  }

  public static CredentialTypeDto mapCredentialTypeToApi(
      de.eshg.base.citizenuser.api.CredentialTypeDto credentialType) {
    return switch (credentialType) {
      case PIN -> CredentialTypeDto.PIN;
      case DATE_OF_BIRTH -> CredentialTypeDto.DATE_OF_BIRTH;
    };
  }
}

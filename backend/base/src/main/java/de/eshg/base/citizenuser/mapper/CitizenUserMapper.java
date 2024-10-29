/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.mapper;

import de.eshg.base.citizenuser.api.CitizenUserRoleDto;
import de.eshg.lib.keycloak.CitizenPermissionRole;
import java.util.*;

public final class CitizenUserMapper {

  private CitizenUserMapper() {
    // static mapper
  }

  private static CitizenUserRoleDto mapPermissionRoleToApi(CitizenPermissionRole role) {
    return switch (role) {
      case ACCESS_CODE_USER -> CitizenUserRoleDto.ACCESS_CODE_USER;
      case MUK_USER -> CitizenUserRoleDto.MUK_USER;
      case STANDARD_CITIZEN -> CitizenUserRoleDto.STANDARD_CITIZEN;
      case BUND_ID_USER -> CitizenUserRoleDto.BUND_ID_USER;
    };
  }

  public static Optional<CitizenUserRoleDto> mapKeycloakRoleToApi(String roleName) {
    return Arrays.stream(CitizenPermissionRole.values())
        .filter(role -> role.getKeycloakName().equals(roleName))
        .map(CitizenUserMapper::mapPermissionRoleToApi)
        .findFirst();
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.mapper;

import de.eshg.base.citizenuser.api.BundIdUserAttributesDto;
import de.eshg.base.citizenuser.api.CitizenUserRoleDto;
import de.eshg.base.citizenuser.api.GetCitizenSelfUserResponse;
import de.eshg.base.citizenuser.api.MukUserAttributesDto;
import de.eshg.base.gdpr.BundIdAttributesMapper;
import de.eshg.base.gdpr.MukAttributesMapper;
import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.CitizenUserAttribute;
import java.util.*;
import org.keycloak.representations.idm.UserRepresentation;

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

  public static GetCitizenSelfUserResponse mapUserRepresentationToCitizenUserNames(
      UserRepresentation representation) {
    if (representation == null || representation.getAttributes() == null) {
      return new GetCitizenSelfUserResponse(null, null);
    }

    Map<String, List<String>> attributes = representation.getAttributes();

    if (attributes.containsKey(CitizenUserAttribute.BUND_ID_B_PK_2.getKey())) {
      return new GetCitizenSelfUserResponse(
          new BundIdUserAttributesDto(
              representation.getFirstName(),
              representation.getLastName(),
              BundIdAttributesMapper.extractDomesticAddressDto(attributes)),
          null);
    }

    if (attributes.containsKey(CitizenUserAttribute.MUK_FACILITY_NAME.getKey())) {
      String facilityName =
          attributes.get(CitizenUserAttribute.MUK_FACILITY_NAME.getKey()).getFirst();
      return new GetCitizenSelfUserResponse(
          null,
          new MukUserAttributesDto(
              facilityName, MukAttributesMapper.extractDomesticAddressDto(attributes)));
    }

    return new GetCitizenSelfUserResponse(null, null);
  }
}

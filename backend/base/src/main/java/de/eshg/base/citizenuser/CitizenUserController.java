/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser;

import de.eshg.base.citizenuser.api.CitizenUserRoleDto;
import de.eshg.base.citizenuser.api.GetCitizenPermissionsResponse;
import de.eshg.base.citizenuser.mapper.CitizenUserMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "CitizenUser")
public class CitizenUserController implements CitizenUserApi {

  private final CitizenUserService citizenUserService;

  public CitizenUserController(CitizenUserService citizenUserService) {
    this.citizenUserService = citizenUserService;
  }

  @Override
  public GetCitizenPermissionsResponse getCitizenSelfUserPermissions() {
    List<CitizenUserRoleDto> roles =
        citizenUserService.getUserKeycloakRoles().stream()
            .map(CitizenUserMapper::mapKeycloakRoleToApi)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .sorted()
            .toList();
    return new GetCitizenPermissionsResponse(roles);
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser;

import de.eshg.base.centralfile.PersonController;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.citizenuser.mapper.CitizenAccessCodeUserMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.util.UUID;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "CitizenAccessCodeUser")
public class CitizenAccessCodeUserController implements CitizenAccessCodeUserApi {

  private final CitizenUserService citizenUserService;

  private final PersonController personController;

  public CitizenAccessCodeUserController(
      CitizenUserService citizenUserService, PersonController personController) {
    this.citizenUserService = citizenUserService;
    this.personController = personController;
  }

  @Override
  public CitizenAccessCodeUserDto getCitizenAccessCodeUser(UUID userId) {
    return CitizenAccessCodeUserMapper.mapUserToApi(citizenUserService.getUserByIdOrThrow(userId));
  }

  @Override
  public CitizenAccessCodeUserDto addCitizenAccessCodeUser(
      AddCitizenAccessCodeUserRequest request) {
    LocalDate dateOfBirth =
        personController.getPersonFileState(request.personFileStateId()).dateOfBirth();
    UserRepresentation createdUser = citizenUserService.addAccessCodeUser(dateOfBirth);
    return CitizenAccessCodeUserMapper.mapUserToApi(createdUser);
  }

  @Override
  public void deleteCitizenAccessCodeUser(UUID userId) {
    citizenUserService.deleteAccessCodeUser(userId);
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser;

import de.eshg.base.centralfile.PersonController;
import de.eshg.base.citizenuser.api.AddAnonymousUserRequest;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.citizenuser.api.VerifyPinRequest;
import de.eshg.base.citizenuser.mapper.CitizenAccessCodeUserMapper;
import de.eshg.keycloak.api.user.model.CredentialType;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.util.UUID;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

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

  @Override
  public CitizenAccessCodeUserDto addAnonymousUser(AddAnonymousUserRequest request) {
    UserRepresentation rep = citizenUserService.addAnonymousUser(request.pin());
    return CitizenAccessCodeUserMapper.mapUserToApi(rep);
  }

  @Override
  public void deleteAnonymousUser(UUID userId) {
    citizenUserService.deleteAnonymousUser(userId);
  }

  @Override
  public void verifyAnonymousUserPin(UUID userId, VerifyPinRequest request) {
    try {
      citizenUserService.verifyCredential(userId, CredentialType.PIN, request.pin());
    } catch (jakarta.ws.rs.NotAuthorizedException e) {
      throw HttpClientErrorException.create(
          HttpStatus.UNAUTHORIZED, e.getMessage(), null, null, null);
    } catch (jakarta.ws.rs.NotFoundException e) {
      throw new NotFoundException(e.getMessage());
    }
  }
}

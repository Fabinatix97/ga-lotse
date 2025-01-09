/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser;

import de.eshg.base.centralfile.PersonController;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithPinCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.citizenuser.api.VerifyCitizenAccessCodeUserCredentialsRequest;
import de.eshg.base.citizenuser.mapper.CitizenAccessCodeUserMapper;
import de.eshg.keycloak.api.user.model.CredentialTypeDto;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.format.DateTimeFormatter;
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
  public CitizenAccessCodeUserDto addCitizenAccessCodeUserWithDateOfBirthCredential(
      AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest request) {
    UserRepresentation createdUser = citizenUserService.addAccessCodeUser();
    String formattedDateOfBirth =
        personController
            .getPersonFileState(request.personFileStateId())
            .dateOfBirth()
            .format(DateTimeFormatter.ISO_LOCAL_DATE);
    citizenUserService.addCredential(
        UUID.fromString(createdUser.getId()),
        CredentialTypeDto.DATE_OF_BIRTH,
        formattedDateOfBirth);
    return CitizenAccessCodeUserMapper.mapUserToApi(createdUser);
  }

  @Override
  public CitizenAccessCodeUserDto addCitizenAccessCodeUserWithPinCredential(
      AddCitizenAccessCodeUserWithPinCredentialRequest request) {
    UserRepresentation createdUser = citizenUserService.addAccessCodeUser();
    citizenUserService.addCredential(
        UUID.fromString(createdUser.getId()), CredentialTypeDto.PIN, request.pin());
    return CitizenAccessCodeUserMapper.mapUserToApi(createdUser);
  }

  @Override
  public CitizenAccessCodeUserDto getCitizenAccessCodeUser(UUID userId) {
    return CitizenAccessCodeUserMapper.mapUserToApi(citizenUserService.getUserByIdOrThrow(userId));
  }

  @Override
  public void deleteCitizenAccessCodeUser(UUID userId) {
    citizenUserService.deleteAccessCodeUser(userId);
  }

  @Override
  public void verifyCitizenAccessCodeUserCredentials(
      UUID userId, VerifyCitizenAccessCodeUserCredentialsRequest request) {
    try {
      citizenUserService.verifyCredential(
          userId,
          CitizenAccessCodeUserMapper.mapCredentialTypeToApi(request.credentialType()),
          request.rawSecret());
    } catch (jakarta.ws.rs.NotAuthorizedException e) {
      throw HttpClientErrorException.create(
          HttpStatus.UNAUTHORIZED, e.getMessage(), null, null, null);
    } catch (jakarta.ws.rs.NotFoundException e) {
      throw new NotFoundException(e.getMessage());
    }
  }
}

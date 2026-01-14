/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.CredentialTypeDto;
import de.eshg.base.citizenuser.api.UpdateCredentialRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.util.UUID;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class CitizenService {

  private final StiProtectionProcedureRepository repository;
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;

  public CitizenService(
      StiProtectionProcedureRepository repository,
      CitizenAccessCodeUserApi citizenAccessCodeUserApi) {
    this.repository = repository;
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
  }

  public StiProtectionProcedure getProcedure(Jwt principal) {
    return findByAnonymousUserId(getCitizenUserId(principal));
  }

  private UUID getCitizenUserId(Jwt principal) {
    return UUID.fromString(principal.getSubject());
  }

  private StiProtectionProcedure findByAnonymousUserId(UUID anonymousUserId) {
    return repository
        .findByAnonymousUserId(anonymousUserId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "%s with given anonymous UUID not found"
                        .formatted(StiProtectionProcedure.class.getSimpleName())));
  }

  public void updateAnonymousUserPin(String currentPin, String newPin) {
    try {
      citizenAccessCodeUserApi.updateCredential(
          new UpdateCredentialRequest(CredentialTypeDto.PIN, currentPin, newPin));
    } catch (HttpClientErrorException.BadRequest e) {
      throw new BadRequestException("Invalid credentials");
    }
  }
}

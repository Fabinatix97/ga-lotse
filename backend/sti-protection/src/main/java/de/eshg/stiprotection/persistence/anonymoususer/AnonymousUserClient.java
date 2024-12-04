/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.anonymoususer;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddAnonymousUserRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.base.citizenuser.api.VerifyPinRequest;
import de.eshg.rest.service.error.NotFoundException;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AnonymousUserClient {
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;

  public AnonymousUserClient(CitizenAccessCodeUserApi citizenAccessCodeUserApi) {
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
  }

  public String getAccessCode(UUID anonymousUserId) {
    if (anonymousUserId == null) {
      return null;
    }
    try {
      return citizenAccessCodeUserApi.getCitizenAccessCodeUser(anonymousUserId).accessCode();
    } catch (NotFoundException e) {
      return null;
    }
  }

  public CitizenAccessCodeUserDto addAnonymousUser(AddAnonymousUserRequest request) {
    return citizenAccessCodeUserApi.addAnonymousUser(request);
  }

  public void verifyAnonymousUserPin(UUID userId, String pin) {
    citizenAccessCodeUserApi.verifyAnonymousUserPin(userId, new VerifyPinRequest(pin));
  }
}

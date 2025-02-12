/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.user;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class CitizenAccessCodeUserClient {
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;

  public CitizenAccessCodeUserClient(CitizenAccessCodeUserApi citizenAccessCodeUserApi) {
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
  }

  public CitizenAccessCodeUserDto addCitizenAccessCodeUser(UUID personFileStateId) {
    AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest request =
        new AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest(personFileStateId);
    return citizenAccessCodeUserApi.addCitizenAccessCodeUserWithDateOfBirthCredential(request);
  }

  public CitizenAccessCodeUserDto getCitizenAccessCode(UUID citizenUserId) {
    return citizenAccessCodeUserApi.getCitizenAccessCodeUser(citizenUserId);
  }

  public void deleteCitizenAccessCodeUser(UUID citizenUserId) {
    citizenAccessCodeUserApi.deleteCitizenAccessCodeUser(citizenUserId);
  }
}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserRequest;
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
    AddCitizenAccessCodeUserRequest request =
        new AddCitizenAccessCodeUserRequest(personFileStateId);
    return citizenAccessCodeUserApi.addCitizenAccessCodeUser(request);
  }

  public CitizenAccessCodeUserDto getCitizenAccessCode(UUID citizenUserId) {
    return citizenAccessCodeUserApi.getCitizenAccessCodeUser(citizenUserId);
  }

  public void deleteCitizenAccessCodeUser(UUID citizenUserId) {
    citizenAccessCodeUserApi.deleteCitizenAccessCodeUser(citizenUserId);
  }
}

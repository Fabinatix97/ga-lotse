/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.testhelper;

import de.eshg.lib.keycloak.LsdTestUser;
import de.eshg.lsd.keycloak.LsdKeycloakClient;
import de.eshg.lsd.keycloak.PermissionRole;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class KeycloakUserTestHelper {

  private final LsdKeycloakClient keycloakClient;

  public KeycloakUserTestHelper(LsdKeycloakClient keycloakClient) {
    this.keycloakClient = keycloakClient;
  }

  public void addDefaultusers() {
    for (LsdTestUser testUser : LsdTestUser.values()) {
      addActor(testUser);
    }
  }

  public void addActor(LsdTestUser user) {
    if (keycloakClient.getUserRepresentationByName(user.username()).isEmpty()) {
      keycloakClient.addUser(
          user.username(), null, null, user.password(), PermissionRole.LSD_ADMIN);
    }
  }
}

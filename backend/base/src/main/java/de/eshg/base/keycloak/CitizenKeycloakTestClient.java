/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.base.citizenuser.CitizenUserService;
import de.eshg.lib.keycloak.Realm;
import de.eshg.lib.keycloak.UsernamePassword;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.util.UUID;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Component;

@Component
@Conditional(KeycloakTestClient.TestHelperOrTestUserProvisioningEnabled.class)
public class CitizenKeycloakTestClient extends KeycloakTestClient {

  private final CitizenUserService citizenUserService;

  public CitizenKeycloakTestClient(
      CitizenKeycloakClient client,
      KeycloakProperties keycloakProperties,
      CitizenUserService citizenUserService,
      @Value("${eshg.keycloak.test-client.max-number-of-parallel-threads:8}")
          int maxNumberOfParallelThreads,
      EnvironmentConfig environmentConfig,
      ObjectMapper objectMapper) {
    super(client, keycloakProperties, maxNumberOfParallelThreads, environmentConfig, objectMapper);
    this.citizenUserService = citizenUserService;
  }

  public UsernamePassword getUsernameAndPasswordOfCitizenAccessCodeUser(UUID userId) {
    UserRepresentation representation =
        keycloakClient.getUserResource(userId.toString()).toRepresentation();
    String password = citizenUserService.getPasswordOfAccessCodeUser(representation);
    return new UsernamePassword(representation.getUsername(), password, Realm.CITIZENS);
  }
}

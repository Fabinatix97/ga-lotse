/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import de.eshg.testhelper.environment.EnvironmentConfig;
import java.util.List;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Component;

@Component
@Conditional(KeycloakTestClient.TestHelperOrTestUserProvisioningEnabled.class)
public class EmployeeKeycloakTestClient extends KeycloakTestClient {

  public EmployeeKeycloakTestClient(
      EmployeeKeycloakClient client,
      KeycloakProperties keycloakProperties,
      @Value("${eshg.keycloak.test-client.max-number-of-parallel-threads:8}")
          int maxNumberOfParallelThreads,
      EnvironmentConfig environmentConfig) {
    super(client, keycloakProperties, maxNumberOfParallelThreads, environmentConfig);
  }

  public UserRepresentation createTemporaryTestUser() {
    UserRepresentation representation = new UserRepresentation();
    representation.setEnabled(true);
    representation.setUsername(TEMPORARY_TEST_USER_USERNAME);
    representation.setFirstName("Temporary");
    representation.setLastName("TestUser");
    representation.setEmail("temporary_test_user@eshg.de");
    representation.setEmailVerified(true);
    representation.setGroups(List.of());
    UserResource user = keycloakClient.createUser(representation);
    UserRepresentation created = user.toRepresentation();
    created.setRequiredActions(List.of());
    user.update(created);
    user.resetPassword(getPasswordCredentialAttributes("password"));
    return created;
  }
}

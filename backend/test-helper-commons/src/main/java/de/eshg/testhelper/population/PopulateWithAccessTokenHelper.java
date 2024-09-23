/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.population;

import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.lib.keycloak.EmployeeTestUser;
import de.eshg.lib.keycloak.KeycloakUser;
import de.eshg.testhelper.AccessToken;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.api.RealmDto;
import de.eshg.testhelper.api.TestHelperLoginRequest;
import de.eshg.testhelper.security.AuthenticationSupport;
import java.util.function.Supplier;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
@ConditionalOnBean(BaseTestHelperApi.class)
public class PopulateWithAccessTokenHelper {

  private final Logger log = LoggerFactory.getLogger(getClass());

  @Value("${eshg.keycloak.test-users-secret-override:}")
  private String testUserPassword;

  private static final KeycloakUser DEFAULT_USER = EmployeeTestUser.DUMMY;

  private final BaseTestHelperApi baseTestHelper;

  public PopulateWithAccessTokenHelper(BaseTestHelperApi baseTestHelper) {
    this.baseTestHelper = baseTestHelper;
  }

  public <T> T doWithAccessToken(Supplier<T> supplier) {
    return doWithAccessToken(DEFAULT_USER, supplier);
  }

  public <T> T doWithAccessToken(KeycloakUser user, Supplier<T> supplier) {
    String password = user.password();
    String username = user.username();
    if (StringUtils.isNotBlank(testUserPassword)) {
      password = testUserPassword;
      log.info("Overriding password of keycloak test user '{}' with: '{}'", username, password);
    }
    AccessToken accessToken =
        baseTestHelper.login(new TestHelperLoginRequest(username, password, RealmDto.EMPLOYEES));
    return AuthenticationSupport.withAuthentication(accessToken, supplier);
  }
}

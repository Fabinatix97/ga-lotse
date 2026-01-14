/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.contact;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import de.eshg.rest.service.security.config.BaseUrls;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class ContactLibraryInternalSecurityConfig {

  @Bean
  public AuthorizationCustomizer authorizationCustomizer() {
    return auth ->
        auth.requestMatchers(
                HttpMethod.POST,
                BaseUrls.ContactLibrary.CONTACT_EVENT_CALLBACK_API + "/contacts-merged")
            .hasRole(EmployeePermissionRole.BASE_CONTACTS_WRITE.name());
  }
}

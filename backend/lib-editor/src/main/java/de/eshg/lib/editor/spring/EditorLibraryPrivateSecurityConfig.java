/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.spring;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import de.eshg.rest.service.security.config.BaseUrls;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EditorLibraryPrivateSecurityConfig {
  public static final String EDITOR_ACCESS_ROLE = "editorAccessRole";
  public static final String TEXTBLOCK_ACCESS_ROLE = "textblockAccessRole";

  @Bean
  public AuthorizationCustomizer editorAuthorizationCustomizer(
      @Qualifier(EDITOR_ACCESS_ROLE) @Autowired(required = false)
          EmployeePermissionRole editorAccessRole) {

    if (editorAccessRole == null) {
      return auth -> auth.requestMatchers(BaseUrls.EditorLibrary.EDITOR_API + "/**").denyAll();
    }

    return auth ->
        auth.requestMatchers(BaseUrls.EditorLibrary.EDITOR_API + "/**")
            .hasRole(editorAccessRole.name());
  }

  @Bean
  public AuthorizationCustomizer textblockAuthorizationCustomizer(
      @Qualifier(TEXTBLOCK_ACCESS_ROLE) @Autowired(required = false)
          EmployeePermissionRole textblockAccessRole) {

    if (textblockAccessRole == null) {
      return auth -> auth.requestMatchers(BaseUrls.EditorLibrary.TEXTBLOCK_API + "/**").denyAll();
    }

    return auth ->
        auth.requestMatchers(BaseUrls.EditorLibrary.TEXTBLOCK_API + "/**")
            .hasRole(textblockAccessRole.name());
  }
}

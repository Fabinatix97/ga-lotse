/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.providers;

import org.keycloak.Config;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.models.RealmModel;
import org.keycloak.services.resources.admin.AdminEventBuilder;
import org.keycloak.services.resources.admin.ext.AdminRealmResourceProvider;
import org.keycloak.services.resources.admin.ext.AdminRealmResourceProviderFactory;
import org.keycloak.services.resources.admin.fgap.AdminPermissionEvaluator;

public class ExtendedUserResourceProvider
    implements AdminRealmResourceProvider, AdminRealmResourceProviderFactory {

  public static final String PROVIDER_ID = "extended-user-resource";

  @Override
  public Object getResource(
      KeycloakSession keycloakSession,
      RealmModel realmModel,
      AdminPermissionEvaluator adminPermissionEvaluator,
      AdminEventBuilder adminEventBuilder) {
    return new ExtendedUserResource(keycloakSession, realmModel, adminPermissionEvaluator);
  }

  @Override
  public AdminRealmResourceProvider create(KeycloakSession keycloakSession) {
    return this;
  }

  @Override
  public void init(Config.Scope scope) {}

  @Override
  public void postInit(KeycloakSessionFactory keycloakSessionFactory) {}

  @Override
  public void close() {}

  @Override
  public String getId() {
    return PROVIDER_ID;
  }
}

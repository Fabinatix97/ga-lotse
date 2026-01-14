/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import de.eshg.base.keycloak.differ.IdentityProviderMapperRepresentationDiffer;
import de.eshg.base.keycloak.differ.IdentityProviderRepresentationDiffer;
import de.eshg.keycloak.api.user.KeycloakUserApi;
import de.eshg.keycloak.api.user.model.CredentialRequest;
import de.eshg.keycloak.api.user.model.CredentialTypeDto;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.keycloak.admin.client.resource.IdentityProviderResource;
import org.keycloak.admin.client.resource.IdentityProvidersResource;
import org.keycloak.representations.idm.IdentityProviderMapperRepresentation;
import org.keycloak.representations.idm.IdentityProviderRepresentation;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

@Component
@DependsOn(MasterKeycloakProvisioning.BEAN_NAME)
public class CitizenKeycloakClient extends RealmBoundKeycloakClient {

  private final KeycloakUserApi keycloakUserApi;

  public CitizenKeycloakClient(KeycloakProperties keycloakProperties) {
    super(keycloakProperties, keycloakProperties.citizenRealm().name());
    String keycloakUrl = keycloakProperties.internal().url();
    URI target = UriBuilder.fromUri(keycloakUrl).build();
    keycloakUserApi = keycloak.proxy(KeycloakUserApi.class, target);
  }

  public void createOrUpdateIdentityProviders(
      List<IdentityProviderRepresentation> identityProviders) {
    IdentityProviderRepresentationDiffer identityProviderRepresentationDiffer =
        new IdentityProviderRepresentationDiffer(
            getIdentityProvidersResource().findAll(), identityProviders);
    identityProviderRepresentationDiffer.getElementsToAdd().forEach(this::addIdentityProvider);
    identityProviderRepresentationDiffer
        .getElementsToUpdate()
        .forEach(this::updateIdentityProvider);
    identityProviderRepresentationDiffer
        .getElementsToDelete()
        .forEach(this::deleteIdentityProvider);
  }

  public void addIdentityProvider(IdentityProviderRepresentation identityProvider) {
    log.info("Adding identity provider '{}'", identityProvider.getAlias());
    try (Response response = getIdentityProvidersResource().create(identityProvider)) {
      assertResponseIs201Created(response);
    }
  }

  public void updateIdentityProvider(ToUpdate<IdentityProviderRepresentation> update) {
    IdentityProviderRepresentation newState = update.newState();
    String alias = newState.getAlias();
    log.info(
        "IdentityProvider '{}' already exists, but update is required:\n{}",
        alias,
        update.multiLineDiff());
    getIdentityProviderResource(alias).update(newState);
  }

  private void deleteIdentityProvider(IdentityProviderRepresentation identityProvider) {
    log.info("Deleting identity provider '{}'", identityProvider.getAlias());
    getIdentityProviderResource(identityProvider.getAlias()).remove();
  }

  private IdentityProviderResource getIdentityProviderResource(String alias) {
    return getIdentityProvidersResource().get(alias);
  }

  private IdentityProvidersResource getIdentityProvidersResource() {
    return getRealm().identityProviders();
  }

  public void createOrUpdateIdentityProviderMappers(
      List<IdentityProviderMapperRepresentation> mappers) {
    IdentityProviderMapperRepresentationDiffer mapperDiffer =
        new IdentityProviderMapperRepresentationDiffer(
            getIdentityProviderMapperRepresentations(), mappers);

    mapperDiffer.getElementsToDelete().forEach(this::deleteIdentityProviderMapper);
    mapperDiffer.getElementsToAdd().forEach(this::addIdentityProviderMapper);
    mapperDiffer.getElementsToUpdate().forEach(this::updateIdentityProviderMapper);
  }

  private void addIdentityProviderMapper(IdentityProviderMapperRepresentation mapper) {
    log.info("Adding identity provider mapper '{}'", mapper.getIdentityProviderMapper());
    try (Response response =
        getIdentityProviderResource(mapper.getIdentityProviderAlias()).addMapper(mapper)) {
      assertResponseIs201Created(response);
    }
  }

  public void updateIdentityProviderMapper(ToUpdate<IdentityProviderMapperRepresentation> update) {
    IdentityProviderMapperRepresentation newState = update.newState();
    log.info(
        "IdentityProvider mapper '{}' already exists, but update is required:\n{}",
        newState.getIdentityProviderMapper(),
        update.multiLineDiff());
    getIdentityProviderResource(newState.getIdentityProviderAlias())
        .update(newState.getId(), newState);
  }

  private void deleteIdentityProviderMapper(IdentityProviderMapperRepresentation mapper) {
    log.info("Deleting identity provider mapper '{}'", mapper.getIdentityProviderMapper());
    getIdentityProviderResource(mapper.getIdentityProviderAlias()).delete(mapper.getId());
  }

  private List<IdentityProviderMapperRepresentation> getIdentityProviderMapperRepresentations() {
    return getIdentityProvidersResource().findAll().stream()
        .map(IdentityProviderRepresentation::getAlias)
        .map(this::getIdentityProviderResource)
        .map(IdentityProviderResource::getMappers)
        .flatMap(List::stream)
        .sorted(
            Comparator.comparing(IdentityProviderMapperRepresentation::getIdentityProviderAlias)
                .thenComparing(IdentityProviderMapperRepresentation::getIdentityProviderMapper))
        .toList();
  }

  public void updateCredential(UUID userId, CredentialTypeDto type, String secret) {
    keycloakUserApi.resetCredential(
        realmName, userId.toString(), new CredentialRequest(type, secret));
  }

  public void verifyCredential(UUID userId, CredentialTypeDto type, String secret) {
    keycloakUserApi.verifyCredential(
        realmName, userId.toString(), new CredentialRequest(type, secret));
  }
}

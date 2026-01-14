/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.keycloak;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.keycloak.KeycloakRole;
import de.eshg.lsd.exception.ActorNotFoundException;
import de.eshg.lsd.keycloak.exception.KeycloakException;
import de.eshg.lsd.keycloak.properties.LsdKeycloakSetupProperties;
import de.eshg.lsd.keycloak.util.Differ;
import de.eshg.lsd.register.api.LsdClientKeycloakProperties;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.Response;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import org.jboss.resteasy.client.jaxrs.internal.ResteasyClientBuilderImpl;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.JacksonProvider;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.*;
import org.keycloak.representations.idm.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.DependsOn;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * This component is supposed to be a thin layer above the Keycloak Admin client for registering
 * certificates for known users.
 */
@Component
@DependsOn(LsdInitialSetupService.BEAN_NAME)
public class LsdKeycloakClient {
  private static final Logger log = LoggerFactory.getLogger(LsdKeycloakClient.class);
  private static final Duration TIMEOUT = Duration.ofSeconds(20);
  private final LsdClientKeycloakProperties lsdClientKeycloakProperties;
  private final LsdKeycloakSetupProperties lsdKeycloakSetupProperties;
  private final ObjectMapper objectMapper;
  private Keycloak keycloak;

  public LsdKeycloakClient(
      LsdClientKeycloakProperties lsdClientKeycloakProperties,
      LsdKeycloakSetupProperties lsdKeycloakSetupProperties,
      ObjectMapper objectMapper) {
    this.lsdClientKeycloakProperties = lsdClientKeycloakProperties;
    this.lsdKeycloakSetupProperties = lsdKeycloakSetupProperties;
    this.objectMapper = objectMapper;
  }

  void updateAuthenticationSettings(Consumer<AuthenticationManagementResource> resourceUpdate) {
    resourceUpdate.accept(getRealm().flows());
  }

  private static void assertResponseIs201Created(Response response) {
    HttpStatus responseStatus = HttpStatus.valueOf(response.getStatus());
    if (responseStatus != HttpStatus.CREATED) {
      throw new KeycloakException("Keycloak REST call failed: " + responseStatus);
    }
  }

  private Client createClientWithTimeout() {
    return new ResteasyClientBuilderImpl()
        .connectTimeout(TIMEOUT.toMillis(), TimeUnit.MILLISECONDS)
        .readTimeout(TIMEOUT.toMillis(), TimeUnit.MILLISECONDS)
        // Keycloak does use the JacksonProvider when initializing the default rest easy client, so
        // we will too
        // see: /org/keycloak/admin/client/spi/ResteasyClientClassicProvider.java:38
        .register(JacksonProvider.class, 100)
        .build();
  }

  @PostConstruct
  public void init() {
    String keycloakUrl = lsdClientKeycloakProperties.url();
    try {
      keycloak =
          KeycloakBuilder.builder()
              .serverUrl(keycloakUrl)
              .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
              .realm(lsdClientKeycloakProperties.realm())
              .clientId(lsdKeycloakSetupProperties.adminClient().clientId())
              .clientSecret(lsdKeycloakSetupProperties.adminClient().clientSecret())
              .resteasyClient(createClientWithTimeout())
              .build();

      log.info("Connected to Keycloak on '{}'.", keycloakUrl);
    } catch (Exception e) {
      throw new KeycloakException("Failed to connect to Keycloak on URL: '" + keycloakUrl + "'", e);
    }
  }

  @PreDestroy
  void close() {
    if (keycloak != null) {
      keycloak.close();
      keycloak = null;
    }
  }

  public RealmResource getRealm() {
    String realmName = getRealmName();
    return keycloak.realm(realmName);
  }

  String getRealmName() {
    return lsdClientKeycloakProperties.realm();
  }

  public void addRole(KeycloakRole role) { // backdoor of keyCloak -> configure it
    RoleRepresentation roleRepresentation = new RoleRepresentation();
    roleRepresentation.setName(role.getKeycloakName());

    List<KeycloakRole> associatedRoles = role.getAssociatedRoles();
    boolean composite = !associatedRoles.isEmpty();
    roleRepresentation.setComposite(composite);

    if (composite) {
      RoleRepresentation.Composites composites = new RoleRepresentation.Composites();
      composites.setRealm(
          associatedRoles.stream().map(KeycloakRole::getKeycloakName).collect(Collectors.toSet()));

      roleRepresentation.setComposites(composites);
    }

    getRealm().roles().create(roleRepresentation);
  }

  public void configureRealm(Consumer<RealmRepresentation> realmUpdate) { // NOSONAR
    String realmName = getRealmName();

    RealmRepresentation realmRepresentation =
        keycloak.realms().findAll().stream()
            .filter(realm -> realm.getRealm().equals(realmName))
            .collect(StreamUtil.toSingleOptionalElement())
            .orElseThrow(
                () -> new IllegalStateException("Could not find realm '" + realmName + "'"));

    String previousRealmAsJson = toJson(realmRepresentation);
    realmUpdate.accept(realmRepresentation);
    String updatedRealmAsJson = toJson(realmRepresentation);

    if (Objects.equals(previousRealmAsJson, updatedRealmAsJson)) {
      log.debug("Keycloak realm '{}' already exists. No change necessary.", realmName);
    } else {
      String realmConfigDiff =
          Differ.calculateMultilineDiff(previousRealmAsJson, updatedRealmAsJson);
      log.info(
          "Keycloak realm '{}' already exists but update is required:\n{}",
          realmName,
          realmConfigDiff);
      getRealm().update(realmRepresentation);
      close();
      init();
    }
  }

  private String toJson(Object value) {
    try {
      return objectMapper.writeValueAsString(value);
    } catch (JsonProcessingException e) {
      throw new KeycloakException("JSON serialization failed", e);
    }
  }

  public void addClient(ClientRepresentation clientRepresentation) {
    try (Response response = getRealm().clients().create(clientRepresentation)) {
      assertResponseIs201Created(response);
    }
    log.info(
        "Added client '{}' to Keycloak realm '{}'",
        clientRepresentation.getClientId(),
        getRealmName());
  }

  public void addUser(
      String username,
      String firstName,
      String lastName,
      String password,
      List<KeycloakRole> roles) {
    UserRepresentation userRepresentation = new UserRepresentation();
    userRepresentation.setUsername(username);
    userRepresentation.setFirstName(firstName);
    userRepresentation.setLastName(lastName);
    userRepresentation.setEnabled(true);

    CredentialRepresentation passwordCredentials = new CredentialRepresentation();
    passwordCredentials.setType(CredentialRepresentation.PASSWORD);
    passwordCredentials.setValue(password);
    passwordCredentials.setTemporary(false);
    userRepresentation.setCredentials(List.of(passwordCredentials));

    addUser(userRepresentation);
    roles.forEach(role -> assignRole(username, role));
  }

  public void addUser(
      String username, String firstName, String lastName, String password, KeycloakRole role) {
    addUser(username, firstName, lastName, password, List.of(role));
  }

  public void addUser(String username, String password, KeycloakRole role) {
    addUser(username, null, null, password, role);
  }

  public void addUser(UserRepresentation userRepresentation) {
    RealmResource realm = getRealm();
    try (Response response = realm.users().create(userRepresentation)) {
      assertResponseIs201Created(response);
    }
    log.info(
        "Added actor with commonName '{}' to Keycloak realm '{}'",
        userRepresentation.getUsername(),
        getRealmName());
  }

  public void assignRole(String username, KeycloakRole role) {
    UserResource user = getUserByNameOrThrow(username);
    RoleResource roleResource = getRealm().roles().get(role.getKeycloakName());
    user.roles().realmLevel().add(List.of(roleResource.toRepresentation()));
  }

  public UserResource getUserByNameOrThrow(String username) {
    return getUserByName(username).orElseThrow(() -> new ActorNotFoundException(username));
  }

  public Optional<UserResource> getUserByName(String username) {
    return getUserRepresentationByName(username).map(user -> getRealm().users().get(user.getId()));
  }

  public Optional<UserRepresentation> getUserRepresentationByName(String username) {
    List<UserRepresentation> reps = getRealm().users().searchByUsername(username, true);
    if (reps.isEmpty()) return Optional.empty();
    return Optional.of(reps.getFirst());
  }

  public List<EventRepresentation> getUserEvents(EventFilterConfig config) {
    return getRealm()
        .getEvents(
            config.types() != null
                ? config.types().stream().map(KeycloakEventType::name).toList()
                : null,
            config.clientId(),
            config.userId(),
            config.dateFrom() != null ? config.dateFrom().format(DateTimeFormatter.ISO_DATE) : null,
            config.dateTo() != null ? config.dateTo().format(DateTimeFormatter.ISO_DATE) : null,
            null,
            config.first(),
            config.maxResults());
  }

  void addClientScope(ClientScopeRepresentation clientScope) {
    try (Response response = getRealm().clientScopes().create(clientScope)) {
      assertResponseIs201Created(response);
    }
  }

  public String getClientId() {
    return lsdClientKeycloakProperties.clientId();
  }

  public String getClientSecret() {
    return lsdClientKeycloakProperties.clientSecret();
  }

  public enum KeycloakEventType {
    LOGIN,
    LOGIN_ERROR
  }
}

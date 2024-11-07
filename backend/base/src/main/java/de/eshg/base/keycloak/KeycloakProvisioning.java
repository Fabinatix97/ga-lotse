/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.RealmBoundKeycloakClient.BASIC_CLIENT_SCOPE;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.SYSTEM_CLIENT_ID_PREFIX;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.SYSTEM_CLIENT_NAME_PREFIX;
import static de.eshg.base.keycloak.RealmBoundKeycloakClient.getClientRepresentationAttributes;

import com.google.common.annotations.VisibleForTesting;
import de.eshg.lib.keycloak.*;
import de.eshg.mutex.MutexService;
import jakarta.annotation.PostConstruct;
import java.net.URI;
import java.time.Duration;
import java.util.*;
import java.util.stream.Stream;
import org.apache.commons.collections4.ListUtils;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.resource.ClientsResource;
import org.keycloak.representations.idm.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * The purpose of this component is to encapsulate ESHG-specific logic for provisioning Keycloak.
 */
public abstract class KeycloakProvisioning<T extends RealmBoundKeycloakClient> {

  protected final Logger log = LoggerFactory.getLogger(getClass());

  public static final List<String> WEBAUTHN_SIGNATURE_ALGORITHMS =
      List.of("Ed25519", "ES256", "RS256");
  // Using weak hash algorithm for test users to speed up credential resets
  public static final String TEST_USER_PASSWORD_POLICY =
      "length(1) and hashAlgorithm(pbkdf2-sha256) and hashIterations(1)";
  public static final String DISABLE_PASSWORD_POLICY = "maxLength(0)";

  public static final String ESHG_AUTH_SERVICE_CLIENT_ID =
      SYSTEM_CLIENT_ID_PREFIX + "eshg-auth-service";
  public static final String TRUE = "true";
  public static final String FALSE = "false";
  protected static final String ESHG_CLIENT_SCOPE_NAME = "eshg";
  private static final String OPENID_CONNECT = "openid-connect";
  private static final String ID_TOKEN_CLAIM = "id.token.claim";
  private static final String USERINFO_TOKEN_CLAIM = "userinfo.token.claim";
  private static final String ACCESS_TOKEN_CLAIM = "access.token.claim";
  private static final String CLAIM_NAME = "claim.name";
  protected static final String PROVISIONING_MUTEX = "KEYCLOAK_PROVISION";

  protected final T keycloakClient;
  protected final KeycloakProperties keycloakProperties;
  private final URI reverseProxyUrl;
  private final KeycloakProperties.Realm realmProperties;

  protected final MutexService mutexService;

  protected KeycloakProvisioning(
      T keycloakClient,
      KeycloakProperties keycloakProperties,
      URI reverseProxyUrl,
      KeycloakProperties.Realm realmProperties,
      MutexService mutexService) {
    this.keycloakClient = keycloakClient;
    this.keycloakProperties = keycloakProperties;
    this.reverseProxyUrl = reverseProxyUrl;
    this.realmProperties = realmProperties;
    this.mutexService = mutexService;
  }

  @PostConstruct
  void provisionRealm() {
    mutexService.doWithLockedMutex(PROVISIONING_MUTEX, this::provisionRealmInternal);
  }

  protected void disableClients(Set<String> clientIds) {
    ClientsResource clients = keycloakClient.getRealm().clients();
    List<ClientRepresentation> realmClients = clients.findAll();

    for (ClientRepresentation client : realmClients) {
      if (clientIds.contains(client.getClientId()) && client.isEnabled()) {
        log.info("Disabling default client '{}'", client.getClientId());
        client.setEnabled(false);
        clients.get(client.getId()).update(client);
      }
    }
  }

  abstract void provisionRealmInternal();

  public void createOrUpdateRealm() {
    keycloakClient.createOrUpdateRealm(this::configureRealm);
  }

  protected void configureRealm(RealmRepresentation realmRepresentation) {
    realmRepresentation.setDisplayName(realmProperties.displayName());
    realmRepresentation.setDisplayNameHtml(realmProperties.displayName());
    realmRepresentation.setSslRequired(realmProperties.sslRequired() ? "external" : "none");
    realmRepresentation.setInternationalizationEnabled(true);
    realmRepresentation.setSupportedLocales(new LinkedHashSet<>(List.of("de", "en")));
    if (this.keycloakProperties.provisionTestUsers()) {
      log.warn("Using lenient password policy");
      realmRepresentation.setPasswordPolicy(TEST_USER_PASSWORD_POLICY);
    }
    realmRepresentation.setDefaultLocale("de");
    realmRepresentation.setLoginTheme("custom-keycloak");
    realmRepresentation.setAdminEventsEnabled(true);
    realmRepresentation.setEventsEnabled(true);
    realmRepresentation.setEventsExpiration(keycloakProperties.eventExpiration().toSeconds());
    realmRepresentation.setSsoSessionIdleTimeout(
        Math.toIntExact(keycloakProperties.sessionTimeout().toSeconds()));
    realmRepresentation.setBruteForceProtected(true);
    realmRepresentation.setWebAuthnPolicyPasswordlessRequireResidentKey("Yes");
    realmRepresentation.setWebAuthnPolicyPasswordlessUserVerificationRequirement("required");
    realmRepresentation.setWebAuthnPolicyPasswordlessSignatureAlgorithms(
        WEBAUTHN_SIGNATURE_ALGORITHMS);
    realmRepresentation.setWebAuthnPolicyPasswordlessRpEntityName("GA Lotse");

    configureHttpSecurityHeaders(log, realmRepresentation);

    KeycloakProperties.Smtp smtp = keycloakProperties.smtp();
    realmRepresentation.setSmtpServer(KeycloakMapper.mapSmtpServer(smtp));

    setAttribute(
        realmRepresentation,
        "adminEventsExpiration",
        String.valueOf(Duration.ofDays(7).toSeconds()));

    setAttribute(realmRepresentation, "frontendUrl", keycloakProperties.url());
  }

  static void configureHttpSecurityHeaders(Logger log, RealmRepresentation realmRepresentation) {
    Map<String, String> securityHeaders = realmRepresentation.getBrowserSecurityHeaders();
    if (securityHeaders == null) {
      securityHeaders = new LinkedHashMap<>();
    }

    for (KeycloakSecurityHeaders header : KeycloakSecurityHeaders.values()) {
      String oldValue = securityHeaders.put(header.getKeycloakName(), header.getValue());
      if (!Objects.equals(oldValue, header.getValue())) {
        log.info(
            "Replaced default security header {}\n-    {}\n+    {}",
            header.name(),
            oldValue,
            header.getValue());
      }
    }

    realmRepresentation.setBrowserSecurityHeaders(securityHeaders);
  }

  protected void createOrUpdateRoles(PermissionRole... permissionRoles) {
    keycloakClient.createOrUpdateRoles(List.of(permissionRoles), this::configureRole);
  }

  protected void configureRole(RoleRepresentation roleRepresentation, KeycloakRole role) {
    roleRepresentation.setName(role.getKeycloakName());
    roleRepresentation.setDescription(role.getDescription());
  }

  public static void setAttribute(
      RealmRepresentation realmRepresentation, String key, String value) {
    Map<String, String> attributes = realmRepresentation.getAttributes();
    if (attributes == null) {
      realmRepresentation.setAttributes(Map.of(key, value));
    } else {
      Map<String, String> newAttributes = new LinkedHashMap<>(attributes);
      newAttributes.put(key, value);
      realmRepresentation.setAttributes(newAttributes);
    }
  }

  protected void createOrUpdateEshgClientScope(PermissionRole... permissionRoles) {
    ClientScopeRepresentation clientScope = new ClientScopeRepresentation();
    clientScope.setName(ESHG_CLIENT_SCOPE_NAME);
    clientScope.setDescription(
        "Sets the user id as sub, the groups and the roles as scope in the token");
    clientScope.setProtocol(OPENID_CONNECT);
    clientScope.setAttributes(Map.of("include.in.token.scope", FALSE));

    clientScope.setProtocolMappers(
        ListUtils.union(List.of(getRolesMapper()), getRoleNameMappers(permissionRoles)));
    keycloakClient.createOrUpdateClientScopes(List.of(clientScope));
  }

  private static List<ProtocolMapperRepresentation> getRoleNameMappers(
      PermissionRole... permissionRoles) {
    return Stream.of(permissionRoles).map(KeycloakProvisioning::getRoleNameMapper).toList();
  }

  private static ProtocolMapperRepresentation getRoleNameMapper(PermissionRole role) {
    ProtocolMapperRepresentation realmRolesMapper = new ProtocolMapperRepresentation();
    realmRolesMapper.setName("Realm Role Name: " + role.getKeycloakName());
    realmRolesMapper.setProtocol(OPENID_CONNECT);
    realmRolesMapper.setProtocolMapper("oidc-role-name-mapper");
    realmRolesMapper.setConfig(
        Map.of("new.role.name", role.name(), "role", role.getKeycloakName()));
    return realmRolesMapper;
  }

  @VisibleForTesting
  public static ProtocolMapperRepresentation getRolesMapper() {
    ProtocolMapperRepresentation realmRolesMapper = new ProtocolMapperRepresentation();
    realmRolesMapper.setName("Realm Roles");
    realmRolesMapper.setProtocol(OPENID_CONNECT);
    realmRolesMapper.setProtocolMapper("oidc-usermodel-realm-role-mapper");
    realmRolesMapper.setConfig(
        Map.of(
            "multivalued",
            TRUE,
            ID_TOKEN_CLAIM,
            FALSE,
            USERINFO_TOKEN_CLAIM,
            TRUE,
            ACCESS_TOKEN_CLAIM,
            TRUE,
            CLAIM_NAME,
            KeycloakRole.CLAIM_NAME));
    return realmRolesMapper;
  }

  protected ClientRepresentation buildEshgAuthServiceClient() {
    ClientRepresentation clientRepresentation = new ClientRepresentation();
    clientRepresentation.setClientId(ESHG_AUTH_SERVICE_CLIENT_ID);
    clientRepresentation.setName(SYSTEM_CLIENT_NAME_PREFIX + "ESHG Auth Service");
    clientRepresentation.setPublicClient(false);
    clientRepresentation.setSecret(realmProperties.authClientSecret());
    clientRepresentation.setRootUrl(reverseProxyUrl.toString());
    clientRepresentation.setBaseUrl(reverseProxyUrl.toString());
    clientRepresentation.setFrontchannelLogout(true);

    UriComponentsBuilder redirectUriBuilder = UriComponentsBuilder.fromUri(reverseProxyUrl);

    clientRepresentation.setRedirectUris(
        List.of(redirectUriBuilder.replacePath("/auth/login/keycloak").toUriString()));
    clientRepresentation.setWebOrigins(List.of("+"));

    clientRepresentation.setAttributes(
        getClientRepresentationAttributes(
            Map.of(
                "post.logout.redirect.uris",
                redirectUriBuilder.replacePath("/logout").toUriString())));
    setEshgClientScopes(clientRepresentation);
    return clientRepresentation;
  }

  static void setEshgClientScopes(ClientRepresentation clientRepresentation) {
    clientRepresentation.setDefaultClientScopes(
        List.of(ESHG_CLIENT_SCOPE_NAME, BASIC_CLIENT_SCOPE));
    clientRepresentation.setOptionalClientScopes(List.of(OAuth2Constants.SCOPE_PROFILE));
  }

  protected void configureUserProfile(KeycloakUserAttribute[] userAttributes) {
    String groupName = realmProperties.name();
    String groupDisplayName = realmProperties.displayName();
    keycloakClient.configureUserProfile(userAttributes, groupName, groupDisplayName);
  }
}

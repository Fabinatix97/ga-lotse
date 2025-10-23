/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.KeycloakProvisioning.FALSE;
import static de.eshg.base.keycloak.KeycloakProvisioning.TRUE;
import static de.eshg.base.keycloak.KeycloakTestProvisioning.TEST_HELPER_CLIENT_ID;
import static de.eshg.base.keycloak.differ.KeycloakDiffer.toJson;

import com.google.common.annotations.VisibleForTesting;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.keycloak.differ.AuthenticationExecutionRepresentationDiffer;
import de.eshg.base.keycloak.differ.ClientRepresentationDiffer;
import de.eshg.base.keycloak.differ.ClientScopeRepresentationDiffer;
import de.eshg.base.keycloak.differ.Differ;
import de.eshg.base.keycloak.differ.GroupRepresentationDiffer;
import de.eshg.base.keycloak.differ.KeycloakDiffer;
import de.eshg.base.keycloak.differ.ProtocolMapperDiffer;
import de.eshg.base.keycloak.differ.UserProfileAttributeDiffer;
import de.eshg.lib.keycloak.KeycloakGroup;
import de.eshg.lib.keycloak.KeycloakRole;
import de.eshg.lib.keycloak.KeycloakUserAttribute;
import de.eshg.lib.keycloak.KeycloakUserAttribute.ValidationRule;
import de.eshg.lib.keycloak.UserAttributePermissions;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import jakarta.annotation.PreDestroy;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.Response;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.jboss.resteasy.client.jaxrs.internal.ResteasyClientBuilderImpl;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.JacksonProvider;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.*;
import org.keycloak.representations.idm.*;
import org.keycloak.representations.info.ServerInfoRepresentation;
import org.keycloak.representations.userprofile.config.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class RealmBoundKeycloakClient implements AutoCloseable {

  protected final Logger log = LoggerFactory.getLogger(getClass());
  public static final String BASIC_CLIENT_SCOPE = "basic";
  public static final String SYSTEM_CLIENT_ID_PREFIX = "system-";
  public static final String SYSTEM_CLIENT_NAME_PREFIX = "[System] ";
  private static final String WEB_ORIGINS_CLIENT_SCOPE = "web-origins";
  private static final String ACR_CLIENT_SCOPE = "acr";
  private static final String ADDRESS_CLIENT_SCOPE = "address";
  private static final String ROLE_LIST_CLIENT_SCOPE = "role_list";
  private static final String PHONE_CLIENT_SCOPE = "phone";
  private static final String ROLES_CLIENT_SCOPE = "roles";
  private static final String PROFILE_CLIENT_SCOPE = "profile";
  private static final String OFFLINE_ACCESS_CLIENT_SCOPE = "offline_access";
  private static final String MICROPROFILE_JWT_CLIENT_SCOPE = "microprofile-jwt";
  private static final String ORGANIZATION_CLIENT_SCOPE = "organization";
  private static final String SAML_ORGANIZATION_CLIENT_SCOPE = "saml_organization";
  private static final String EMAIL_CLIENT_SCOPE = "email";
  public static final String ACCOUNT_CLIENT_ID = "account";
  public static final String ACCOUNT_CONSOLE_CLIENT_ID = "account-console";
  public static final String ADMIN_CLI_CLIENT_ID = "admin-cli";
  public static final String BROKER_CLIENT_ID = "broker";
  public static final String SECURITY_ADMIN_CONSOLE_CLIENT_ID = "security-admin-console";
  public static final String REALM_MANAGEMENT_CLIENT_ID = "realm-management";
  private static final Duration TIMEOUT = Duration.ofSeconds(20);

  protected final Keycloak keycloak;
  protected final String realmName;

  private final boolean provisionTestUsers;

  public RealmBoundKeycloakClient(KeycloakProperties keycloakProperties, String realmName) {
    this(keycloakProperties, realmName, true);
  }

  @SuppressWarnings("this-escape")
  @VisibleForTesting
  RealmBoundKeycloakClient(
      KeycloakProperties keycloakProperties, String realmName, boolean isClient) {
    this.realmName = realmName;
    this.provisionTestUsers = keycloakProperties.provisionTestUsers();

    String keycloakUrl = keycloakProperties.internal().url();
    try {
      KeycloakBuilder builder =
          KeycloakBuilder.builder()
              .resteasyClient(createClientWithTimeout())
              .serverUrl(keycloakUrl)
              .realm("master");

      if (isClient) {
        builder
            .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
            .clientId(keycloakProperties.adminClient().getKeycloakClientId())
            .clientSecret(keycloakProperties.adminClient().getKeycloakClientSecret());
      } else {
        builder
            .grantType(OAuth2Constants.PASSWORD)
            .clientId(ADMIN_CLI_CLIENT_ID)
            .username(keycloakProperties.bootstrapAdmin().user())
            .password(keycloakProperties.bootstrapAdmin().password());
      }

      keycloak = builder.build();

      log.info(
          "Connected to Keycloak on '{}'. Keycloak version: {}",
          keycloakUrl,
          keycloak.serverInfo().getInfo().getSystemInfo().getVersion());
    } catch (Exception e) {
      throw new KeycloakException("Failed to connect to Keycloak on URL: '" + keycloakUrl + "'", e);
    }
  }

  public static RealmBoundKeycloakClient createMasterAdminClient(
      KeycloakProperties keycloakProperties) {
    try {
      return new RealmBoundKeycloakClient(keycloakProperties, "master");
    } catch (KeycloakException keycloakException) {
      if (ExceptionUtils.indexOfType(keycloakException, NotAuthorizedException.class) == -1) {
        throw keycloakException;
      }
      // Keycloak didn't accept our client credentials. Retry after creating the client in case this
      // is the first start.
      try (RealmBoundKeycloakClient boostrapClient =
          new RealmBoundKeycloakClient(keycloakProperties, "master", false)) {
        BootstrapKeycloakProvisioning.registerClient(boostrapClient, keycloakProperties);
      }
      return new RealmBoundKeycloakClient(keycloakProperties, "master");
    }
  }

  public void refreshToken() {
    this.keycloak.tokenManager().refreshToken();
  }

  private static ClientRepresentationDiffer getClientsDiffer(
      List<ClientRepresentation> existingClients, List<ClientRepresentation> clients) {
    return new ClientRepresentationDiffer(existingClients, clients);
  }

  private static ClientScopeRepresentationDiffer getClientScopesDiffer(
      List<ClientScopeRepresentation> existingScopes, List<ClientScopeRepresentation> scopes) {
    return new ClientScopeRepresentationDiffer(existingScopes, scopes);
  }

  private static GroupRepresentationDiffer getGroupsDiffer(
      List<GroupRepresentation> existingGroups, List<GroupRepresentation> groups) {
    return new GroupRepresentationDiffer(existingGroups, groups);
  }

  protected static KeycloakDiffer<String> getStringDiffer(
      List<String> existingRoles, List<String> configuredRealmRoles) {
    return new KeycloakDiffer<>(existingRoles, configuredRealmRoles);
  }

  private static AuthenticationExecutionRepresentationDiffer getExecutionDiffer(
      List<AuthenticationExecutionInfoRepresentation> existingExecutions,
      List<AuthenticationExecutionInfoRepresentation> configuredExecutions) {
    return new AuthenticationExecutionRepresentationDiffer(
        existingExecutions, configuredExecutions);
  }

  private void onRealmNotChanged(String realmName) {
    log.debug("Keycloak realm '{}' already exists. No change necessary.", realmName);
  }

  public static String getSelfUserId() {
    SecurityContext context = SecurityContextHolder.getContext();
    return context.getAuthentication().getName();
  }

  static void assertResponseIs201Created(Response response) {
    HttpStatus responseStatus = HttpStatus.valueOf(response.getStatus());
    if (responseStatus != HttpStatus.CREATED) {
      throw new KeycloakException("Keycloak REST call failed: " + responseStatus);
    }
  }

  static void assertResponseIs204NoContent(Response response) {
    HttpStatus responseStatus = HttpStatus.valueOf(response.getStatus());
    if (responseStatus != HttpStatus.NO_CONTENT) {
      throw new KeycloakException("Keycloak REST call failed: " + responseStatus);
    }
  }

  protected static String normalizedQueryTerm(String term) {
    return term.toLowerCase(Locale.ROOT);
  }

  public GroupResource getGroupByName(String groupName) {

    GroupRepresentation group =
        getGroupsResource().groups(groupName, null, null).stream()
            .filter(groupCandidate -> groupCandidate.getName().equals(groupName))
            .collect(StreamUtil.toSingleElement(() -> new NotFoundException("Group not found.")));
    String id = group.getId();
    return getGroupResource(id);
  }

  protected static Client createClientWithTimeout() {
    return new ResteasyClientBuilderImpl()
        .connectTimeout(TIMEOUT.toMillis(), TimeUnit.MILLISECONDS)
        .readTimeout(TIMEOUT.toMillis(), TimeUnit.MILLISECONDS)
        // Keycloak does use the JacksonProvider when initializing the default rest easy client, so
        // we will too
        // see: /org/keycloak/admin/client/spi/ResteasyClientClassicProvider.java:38
        .register(JacksonProvider.class, 100)
        .build();
  }

  @PreDestroy
  @Override
  public void close() {
    keycloak.close();
  }

  ServerInfoRepresentation getServerInfo() {
    return keycloak.serverInfo().getInfo();
  }

  public void createOrUpdateGroups(List<GroupRepresentation> groups) {
    List<GroupRepresentation> existingGroups =
        getGroupsWithRealmRoles().stream()
            .filter(r -> r.getName().startsWith(KeycloakGroup.SYSTEM_PREFIX))
            .toList();

    GroupRepresentationDiffer groupDiffer = getGroupsDiffer(existingGroups, groups);
    groupDiffer.getElementsToAdd().forEach(this::addGroup);
    groupDiffer.getElementsToDelete().forEach(this::deleteGroup);
    groupDiffer.getElementsToUpdate().forEach(this::updateGroup);
  }

  void addGroup(GroupRepresentation groupRepresentation) {
    log.info("Creating Group '{}'", groupRepresentation.getName());
    GroupsResource groupsResource = getGroupsResource();

    try (Response addResponse = groupsResource.add(groupRepresentation)) {
      assertResponseIs201Created(addResponse);
      addRolesToGroup(
          groupRepresentation.getRealmRoles(), CreatedResponseUtil.getCreatedId(addResponse));
    }
  }

  private void addRolesToGroup(List<String> roleNames, String groupId) {
    if (roleNames != null) {
      GroupResource groupResource = getGroupResource(groupId);
      List<RoleRepresentation> roles = toRoleRepresentations(roleNames);
      addRolesToGroup(roles, groupResource);
    }
  }

  private void deleteGroup(GroupRepresentation groupRepresentation) {
    log.info("Deleting Group '{}'", groupRepresentation.getName());
    GroupResource groupResource = getGroupResource(groupRepresentation.getId());
    groupResource.remove();
  }

  private void updateGroup(ToUpdate<GroupRepresentation> update) {
    GroupRepresentation newGroup = update.newState();
    log.info(
        "Group '{}' already exists, but update is required:\n{}",
        newGroup.getName(),
        update.multiLineDiff());
    GroupResource groupResource = getGroupResource(newGroup.getId());
    groupResource.update(newGroup);

    updateGroupRoles(groupResource, newGroup.getRealmRoles());
  }

  private void updateGroupRoles(GroupResource groupResource, List<String> configuredRealmRoles) {
    List<String> existingRoles =
        groupResource.roles().realmLevel().listAll().stream()
            .map(RoleRepresentation::getName)
            .toList();

    KeycloakDiffer<String> groupDiffer = getStringDiffer(existingRoles, configuredRealmRoles);

    addRolesToGroup(toRoleRepresentations(groupDiffer.getElementsToAdd()), groupResource);
    removeRolesFromGroup(toRoleRepresentations(groupDiffer.getElementsToDelete()), groupResource);
  }

  private List<RoleRepresentation> toRoleRepresentations(List<String> elements) {
    return elements.stream().map(this::getRoleByName).toList();
  }

  private void removeRolesFromGroup(List<RoleRepresentation> roles, GroupResource groupResource) {
    groupResource.roles().realmLevel().remove(roles);
  }

  private void addRolesToGroup(List<RoleRepresentation> roles, GroupResource groupResource) {
    groupResource.roles().realmLevel().add(roles);
  }

  private RoleRepresentation getRoleByName(String roleName) {
    return getRoleResource(roleName).toRepresentation();
  }

  private RoleResource getRoleResource(String roleName) {
    return getRealm().roles().get(roleName);
  }

  GroupsResource getGroupsResource() {
    return getRealm().groups();
  }

  GroupResource getGroupResource(String id) {
    return getGroupsResource().group(id);
  }

  public void createOrUpdateRealm(Consumer<RealmRepresentation> realmUpdate) {
    RealmRepresentation realmRepresentation = getRealmIfExists().orElse(null);

    switch (diffRealm(realmRepresentation, realmUpdate)) {
      case RealmDoesNotExist ignored -> onRealmDoesNotExist(realmName, realmUpdate);
      case RealmNotChanged ignored -> onRealmNotChanged(realmName);
      case RealmChanged realmChanges -> onRealmChanged(realmName, realmChanges);
    }
  }

  private void onRealmDoesNotExist(String realmName, Consumer<RealmRepresentation> realmUpdate) {
    log.info("Creating Keycloak realm '{}'", realmName);
    RealmRepresentation realmRepresentation;
    realmRepresentation = new RealmRepresentation();
    realmRepresentation.setRealm(realmName);
    realmRepresentation.setEnabled(true);
    realmUpdate.accept(realmRepresentation);
    keycloak.realms().create(realmRepresentation);
    this.refreshToken();
  }

  private void onRealmChanged(String realmName, RealmChanged change) {
    String diff = change.diff();
    log.info("Keycloak realm '{}' already exists but update is required:\n{}", realmName, diff);
    getRealm().update(change.newState());
  }

  private RealmDiffResult diffRealm(
      RealmRepresentation realmRepresentation, Consumer<RealmRepresentation> realmUpdate) {

    if (realmRepresentation == null) {
      return new RealmDoesNotExist();
    }

    String previousRealmAsJson = toJson(realmRepresentation);
    realmUpdate.accept(realmRepresentation);
    String updatedRealmAsJson = toJson(realmRepresentation);
    if (Objects.equals(previousRealmAsJson, updatedRealmAsJson)) {
      return new RealmNotChanged();
    }
    String realmConfigDiff = Differ.calculateMultilineDiff(previousRealmAsJson, updatedRealmAsJson);
    return new RealmChanged(realmRepresentation, realmConfigDiff);
  }

  public Optional<RealmRepresentation> getRealmIfExists() {
    return keycloak.realms().findAll().stream()
        .filter(realm -> realm.getRealm().equals(realmName))
        .collect(StreamUtil.toSingleOptionalElement());
  }

  public void configureUserProfile(
      KeycloakUserAttribute[] userAttributes, String groupName, String groupDisplayName) {
    UserProfileResource profileResource = getRealm().users().userProfile();
    UPConfig profileConfig = profileResource.getConfiguration();

    UPGroup group = new UPGroup(groupName);
    group.setDisplayHeader(groupDisplayName);
    group.setDisplayDescription("Custom attributes for " + groupDisplayName + " realm");

    if (profileConfig.getGroups().stream().noneMatch(g -> group.getName().equals(g.getName()))) {
      profileConfig.addGroup(group);
    }

    List<UPAttribute> existingAttributes = profileConfig.getAttributes();
    List<UPAttribute> configuredAttributes = getConfiguredAttributes(userAttributes, group);

    UserProfileAttributeDiffer attributeDiffer =
        new UserProfileAttributeDiffer(existingAttributes, configuredAttributes);

    attributeDiffer
        .getElementsToDelete()
        .forEach(attribute -> deleteAttributeFromConfig(attribute, profileConfig));
    attributeDiffer
        .getElementsToAdd()
        .forEach(attribute -> addAttributeToConfig(attribute, profileConfig));
    attributeDiffer
        .getElementsToUpdate()
        .forEach(update -> updateAttributeInConfig(update, profileConfig));

    if (!ListUtils.union(
            attributeDiffer.getElementsToAdd(),
            ListUtils.union(
                attributeDiffer.getElementsToUpdate(), attributeDiffer.getElementsToDelete()))
        .isEmpty()) {
      log.info("Sending user profile update request");
      profileResource.update(profileConfig);
    }
  }

  private void deleteAttributeFromConfig(UPAttribute attribute, UPConfig profileConfig) {
    String attributeName = attribute.getName();
    log.info("Removing attribute '{}'", attributeName);
    profileConfig.removeAttribute(attributeName);
  }

  private void addAttributeToConfig(UPAttribute newAttribute, UPConfig profileConfig) {
    log.info("Adding attribute '{}'", newAttribute.getName());
    profileConfig.addOrReplaceAttribute(newAttribute);
  }

  private void updateAttributeInConfig(ToUpdate<UPAttribute> update, UPConfig profileConfig) {
    UPAttribute newAttribute = update.newState();
    log.info(
        "Attribute '{}' already exists, but update is required:\n{}",
        newAttribute.getName(),
        update.multiLineDiff());
    profileConfig.addOrReplaceAttribute(newAttribute);
  }

  private List<UPAttribute> getConfiguredAttributes(
      KeycloakUserAttribute[] userAttributes, UPGroup group) {
    return Arrays.stream(userAttributes)
        .map(
            attribute -> {
              String attributeName = attribute.getKey();
              UPAttribute attributeConfig = new UPAttribute(attributeName);
              attributeConfig.setDisplayName(attribute.getDisplayName());
              attributeConfig.setRequired(
                  attribute.isRequired() ? new UPAttributeRequired() : null);
              attributeConfig.setGroup(getGroupName(attribute, group));
              UserAttributePermissions permissions = attribute.getPermissions();
              attributeConfig.setPermissions(
                  new UPAttributePermissions(
                      permissions.viewPermissions(), permissions.editPermissions()));
              attributeConfig.setValidations(getAttributeValidations(attribute));
              return attributeConfig;
            })
        .toList();
  }

  private static Map<String, Map<String, Object>> getAttributeValidations(
      KeycloakUserAttribute attribute) {
    Map<String, Map<String, Object>> validations = new LinkedHashMap<>();
    for (ValidationRule rule : attribute.getValidationRules()) {
      validations.put(rule.ruleId(), rule.toMap());
    }
    return validations;
  }

  private static String getGroupName(KeycloakUserAttribute attribute, UPGroup group) {
    return switch (attribute.getGroup()) {
      case DEFAULT -> null;
      case CUSTOM -> group.getName();
    };
  }

  public void createOrUpdateRoles(
      List<KeycloakRole> configuredRoles, BiConsumer<RoleRepresentation, KeycloakRole> roleUpdate) {
    RolesResource rolesResource = getRealm().roles();
    List<RoleRepresentation> existingRealmRoles = getSystemRoles();
    List<KeycloakRole> missingRoles = new ArrayList<>(configuredRoles);

    existingRealmRoles.stream()
        .filter(r -> !getIgnoredRoleNames().contains(r.getName()))
        .forEach(
            existingRole ->
                updateOrDeleteExistingRole(roleUpdate, missingRoles, rolesResource, existingRole));
    missingRoles.forEach(
        roleConfig -> {
          RoleRepresentation newRoleRepresentation =
              getNewRoleRepresentation(roleUpdate, roleConfig);
          addRole(rolesResource, newRoleRepresentation);
        });

    // composite assignments need to be done in a second step, since composites in a
    // RoleRepresentation only take effect in keycloak on role creation, not on update!
    createOrUpdateRoleComposites(configuredRoles);
  }

  void addRole(RoleRepresentation newRoleRepresentation) {
    addRole(getRealm().roles(), newRoleRepresentation);
  }

  private void addRole(RolesResource rolesResource, RoleRepresentation newRoleRepresentation) {
    log.info("Creating role {}", newRoleRepresentation.getName());
    rolesResource.create(newRoleRepresentation);
  }

  private void updateOrDeleteExistingRole(
      BiConsumer<RoleRepresentation, KeycloakRole> roleUpdate,
      List<KeycloakRole> configuredRoles,
      RolesResource rolesResource,
      RoleRepresentation existingRole) {
    String roleName = existingRole.getName();
    Optional<KeycloakRole> configuredRoleOpt =
        configuredRoles.stream()
            .filter(r -> roleName.equals(r.getKeycloakName()))
            .collect(StreamUtil.toSingleOptionalElement());

    if (configuredRoleOpt.isPresent()) {
      KeycloakRole configuredRole = configuredRoleOpt.get();
      updateExistingRole(existingRole, configuredRole, roleUpdate, rolesResource);

      configuredRoles.remove(configuredRole);
    } else {
      log.info("Keycloak role {} already exists but shouldn't. Deleting it.", roleName);
      rolesResource.deleteRole(roleName);
    }
  }

  private void updateExistingRole(
      RoleRepresentation existingRole,
      KeycloakRole configuredRole,
      BiConsumer<RoleRepresentation, KeycloakRole> roleUpdate,
      RolesResource rolesResource) {
    String roleName = existingRole.getName();
    RoleResource roleResource = rolesResource.get(roleName);

    String previousRoleAsJson = toJson(existingRole);
    roleUpdate.accept(existingRole, configuredRole);
    String updatedRoleAsJson = toJson(existingRole);
    if (Objects.equals(previousRoleAsJson, updatedRoleAsJson)) {
      log.debug("Keycloak role '{}' already exists. No change necessary.", roleName);
    } else {
      String roleConfigDiff = Differ.calculateMultilineDiff(previousRoleAsJson, updatedRoleAsJson);
      log.info(
          "Keycloak role '{}' already exists but update is required:\n{}",
          roleName,
          roleConfigDiff);
      roleResource.update(existingRole);
    }
  }

  List<String> getIgnoredClientScopes() {
    return List.of(
        BASIC_CLIENT_SCOPE,
        WEB_ORIGINS_CLIENT_SCOPE,
        ACR_CLIENT_SCOPE,
        ADDRESS_CLIENT_SCOPE,
        ROLE_LIST_CLIENT_SCOPE,
        PHONE_CLIENT_SCOPE,
        ROLES_CLIENT_SCOPE,
        PROFILE_CLIENT_SCOPE,
        OFFLINE_ACCESS_CLIENT_SCOPE,
        MICROPROFILE_JWT_CLIENT_SCOPE,
        EMAIL_CLIENT_SCOPE,
        ORGANIZATION_CLIENT_SCOPE,
        SAML_ORGANIZATION_CLIENT_SCOPE);
  }

  List<String> getIgnoredClientIds() {

    List<String> ids =
        new ArrayList<>(
            List.of(
                ACCOUNT_CLIENT_ID,
                ACCOUNT_CONSOLE_CLIENT_ID,
                ADMIN_CLI_CLIENT_ID,
                BROKER_CLIENT_ID,
                REALM_MANAGEMENT_CLIENT_ID,
                SECURITY_ADMIN_CONSOLE_CLIENT_ID));
    if (provisionTestUsers) {
      ids.add(TEST_HELPER_CLIENT_ID);
    }
    return ids;
  }

  List<String> getIgnoredRoleNames() {
    return List.of(OFFLINE_ACCESS_CLIENT_SCOPE, getDefaultRoleName(), "uma_authorization");
  }

  private RoleRepresentation getNewRoleRepresentation(
      BiConsumer<RoleRepresentation, KeycloakRole> roleUpdate, KeycloakRole role) {
    RoleRepresentation roleRepresentation = new RoleRepresentation();
    roleUpdate.accept(roleRepresentation, role);
    return roleRepresentation;
  }

  private void createOrUpdateRoleComposites(List<KeycloakRole> allConfiguredRoles) {
    allConfiguredRoles.forEach(
        roleConfig -> {
          String roleName = roleConfig.getKeycloakName();
          RoleResource roleResource = getRoleResource(roleName);
          List<RoleRepresentation> existingRoleComposites = getRoleComposites(roleResource);

          List<String> existingRoleCompositeNames =
              existingRoleComposites.stream().map(RoleRepresentation::getName).toList();
          List<String> configuredRoleCompositeNames =
              roleConfig.getAssociatedRoles().stream().map(KeycloakRole::getKeycloakName).toList();

          createOrUpdateRoleComposites(
              roleResource, existingRoleCompositeNames, configuredRoleCompositeNames);
        });
  }

  protected Map<String, RoleRepresentation> getRoleRepresentationsByName() {
    return getRealm().roles().list().stream()
        .collect(StreamUtil.toLinkedHashMap(RoleRepresentation::getName));
  }

  private List<RoleRepresentation> getRoleComposites(RoleResource roleResource) {
    return roleResource.getRealmRoleComposites().stream()
        .sorted(Comparator.comparing(RoleRepresentation::getName))
        .toList();
  }

  void updateAuthenticationSettings(Consumer<AuthenticationManagementResource> resourceUpdate) {
    resourceUpdate.accept(getRealm().flows());
  }

  void createOrUpdateClients(List<ClientRepresentation> clients) {
    Predicate<ClientRepresentation> existingClientsPredicate =
        c -> c.getClientId().startsWith(SYSTEM_CLIENT_ID_PREFIX);
    createOrUpdateClients(clients, existingClientsPredicate);
  }

  void createOrUpdateClients(
      List<ClientRepresentation> clients,
      Predicate<ClientRepresentation> existingClientsToConsiderPredicate) {
    List<ClientRepresentation> existingClients =
        getRealm().clients().findAll().stream()
            .filter(c -> !getIgnoredClientIds().contains(c.getClientId()))
            .filter(existingClientsToConsiderPredicate)
            .toList();

    ClientRepresentationDiffer clientDiffer = getClientsDiffer(existingClients, clients);
    clientDiffer.getElementsToAdd().forEach(this::addClient);
    clientDiffer.getElementsToDelete().forEach(this::deleteClient);
    clientDiffer.getElementsToUpdate().forEach(this::updateClient);
  }

  void addClient(ClientRepresentation clientRepresentation) {
    log.info("Adding client '{}'", clientRepresentation.getClientId());
    try (Response response = getRealm().clients().create(clientRepresentation)) {
      assertResponseIs201Created(response);
    }
  }

  void deleteClient(ClientRepresentation clientRepresentation) {
    log.info(
        "Removing client '{}' from Keycloak realm '{}'",
        clientRepresentation.getClientId(),
        realmName);
    getRealm().clients().get(clientRepresentation.getId()).remove();
  }

  void updateClient(ToUpdate<ClientRepresentation> update) {
    ClientRepresentation newClient = update.newState();
    log.info(
        "Client '{}' already exists, but update is required:\n{}",
        newClient.getClientId(),
        update.multiLineDiff());
    if (!update.multiLineDiff().contains("secret")) {
      getRealm().clients().get(newClient.getId()).update(newClient);
      log.info("Client '{}' updated.", newClient.getClientId());
    } else {
      deleteClient(newClient);
      addClient(newClient);
    }
  }

  void configureFlow(AuthenticationFlowRepresentation flow) {
    Optional<AuthenticationFlowRepresentation> existingFlow =
        getRealm().flows().getFlows().stream()
            .filter(f -> StringUtils.equals(f.getAlias(), flow.getAlias()))
            .findAny();
    if (existingFlow.isEmpty()) {
      log.info(
          "Adding authentication flow '{}' to Keycloak realm '{}'", flow.getAlias(), realmName);
      try (Response response = getRealm().flows().createFlow(flow)) {
        assertResponseIs201Created(response);
      }
    } else {
      log.info(
          "Configuring authentication flow '{}' on Keycloak realm '{}'",
          flow.getAlias(),
          realmName);
      getRealm().flows().updateFlow(existingFlow.get().getId(), flow);
    }
  }

  public void addOrUpdateExecutions(
      String parentFlow,
      Map<String, List<AuthenticationExecutionInfoRepresentation>> configuredExecutions) {

    // 1. Diff all executions on parent flow, delete all that are obsolete
    List<AuthenticationExecutionInfoRepresentation> existingExecutions =
        getRealm().flows().getExecutions(parentFlow);

    List<AuthenticationExecutionInfoRepresentation> allConfiguredExecutions = new ArrayList<>();
    configuredExecutions.forEach(
        (flowName, executions) -> {
          for (int i = 0; i < executions.size(); i++) {
            AuthenticationExecutionInfoRepresentation execution = executions.get(i);
            execution.setIndex(i);
            execution.setPriority(i);
            allConfiguredExecutions.add(execution);
          }
        });

    AuthenticationExecutionRepresentationDiffer executionDiffer =
        getExecutionDiffer(existingExecutions, allConfiguredExecutions);
    executionDiffer.getElementsToDelete().forEach(exe -> deleteExecution(exe, parentFlow));

    // 2. Figure out parent flow for each and then add or update based on that
    configuredExecutions.forEach(
        (flowName, executions) -> {
          AuthenticationExecutionRepresentationDiffer differ =
              getExecutionDiffer(existingExecutions, executions);
          differ.getElementsToAdd().forEach(exe -> addExecution(exe, flowName));
          differ.getElementsToUpdate().forEach(exe -> updateExecution(exe, flowName));
        });
  }

  private void deleteExecution(
      AuthenticationExecutionInfoRepresentation execution, String parentFlow) {
    log.info(
        "Removing authentication execution '{}' from parent flow '{}' in Keycloak realm '{}'",
        execution.getProviderId(),
        parentFlow,
        realmName);
    getRealm().flows().removeExecution(execution.getId());
  }

  private void addExecution(
      AuthenticationExecutionInfoRepresentation execution, String parentFlow) {
    log.info(
        "Adding authentication execution '{}' to parent flow {} to Keycloak realm '{}'",
        execution.getProviderId(),
        parentFlow,
        realmName);
    if (execution.getAuthenticationFlow() == Boolean.TRUE) {
      getRealm()
          .flows()
          .addExecutionFlow(
              parentFlow,
              Map.of(
                  "alias",
                  execution.getAlias(),
                  "description",
                  execution.getDescription() == null ? "" : execution.getDescription(),
                  "provider",
                  execution.getProviderId(),
                  "type",
                  "basic-flow"));
    } else {
      getRealm().flows().addExecution(parentFlow, Map.of("provider", execution.getProviderId()));
    }
    AuthenticationExecutionInfoRepresentation addedExecution =
        getExecution(execution, parentFlow).getFirst();
    addedExecution.setRequirement(execution.getRequirement());
    getRealm().flows().updateExecutions(parentFlow, addedExecution);
  }

  private List<AuthenticationExecutionInfoRepresentation> getExecution(
      AuthenticationExecutionInfoRepresentation execution, String parentFlow) {
    return getRealm().flows().getExecutions(parentFlow).stream()
        .filter(
            exec -> // Subflows do not have a provider id
            StringUtils.equals(exec.getProviderId(), execution.getProviderId())
                    || StringUtils.equals(exec.getDisplayName(), execution.getAlias()))
        .toList();
  }

  private void updateExecution(
      ToUpdate<AuthenticationExecutionInfoRepresentation> toUpdate, String parentFlow) {
    AuthenticationExecutionInfoRepresentation executionUpdate = toUpdate.newState();
    log.info(
        "Updating authentication execution '{}' of parent flow {} on Keycloak realm '{}'",
        executionUpdate.getProviderId(),
        parentFlow,
        realmName);
    getRealm().flows().updateExecutions(parentFlow, executionUpdate);
  }

  void bindBrowserFlow(String browserFlowAlias) {
    log.info(
        "Binding '{}' flow as default browser flow of Keycloak realm '{}'",
        browserFlowAlias,
        realmName);
    RealmRepresentation realmRepresentation = getRealm().toRepresentation();
    realmRepresentation.setBrowserFlow(browserFlowAlias);
    getRealm().update(realmRepresentation);
  }

  public UserResource createUser(UserRepresentation userRepresentation) {
    return createUser(getRealm().users(), userRepresentation);
  }

  public UserResource createUser(
      UsersResource usersResource, UserRepresentation userRepresentation) {
    try (Response response = usersResource.create(userRepresentation)) {
      if (response.getStatus() == HttpStatus.CONFLICT.value()) {
        throw new BadRequestException(ErrorCode.ALREADY_EXISTS, "User already exists");
      }
      if (response.getStatusInfo().getFamily() != Response.Status.Family.SUCCESSFUL) {
        throw new BadRequestException(ErrorCode.UNEXPECTED_ERROR, "Failed to create user");
      }
      String userId = CreatedResponseUtil.getCreatedId(response);
      return getUserResource(userId);
    }
  }

  public Optional<UserResource> getUserResourceByName(String username) {
    RealmResource realm = getRealm();
    return getUserByName(username).map(user -> realm.users().get(user.getId()));
  }

  public Optional<UserRepresentation> getUserByName(String username) {
    return searchUsersByName(username).collect(StreamUtil.toSingleOptionalElement());
  }

  @VisibleForTesting
  Stream<UserRepresentation> searchUsersByName(String username) {
    RealmResource realm = getRealm();
    return realm.users().searchByUsername(username, true).stream();
  }

  public UserResource getSelfUser() {
    return getUserResource(getSelfUserId());
  }

  public UserResource getUserResource(String userId) {
    return getRealm().users().get(userId);
  }

  public RoleScopeResource getRoleScopeResource(String clientId) {
    return getUserResource(
            getClientByClientId(clientId).orElseThrow().getServiceAccountUser().getId())
        .roles()
        .realmLevel();
  }

  public RealmResource getRealm() {
    return keycloak.realm(this.realmName);
  }

  Optional<ClientResource> getClientByClientId(String clientId) {
    return getRealm().clients().findByClientId(clientId).stream()
        .collect(StreamUtil.toSingleOptionalElement())
        .map(ClientRepresentation::getId)
        .map(id -> getRealm().clients().get(id));
  }

  void disableClients(Set<String> clientIds) {
    ClientsResource clientsResource = getRealm().clients();
    List<ClientRepresentation> clients = clientsResource.findAll();
    for (ClientRepresentation client : clients) {
      if (clientIds.contains(client.getClientId()) && client.isEnabled() == Boolean.TRUE) {
        log.info("Disabling default client '{}'", client.getClientId());
        client.setEnabled(false);
        clientsResource.get(client.getId()).update(client);
      }
    }
  }

  void createOrUpdateClientScopes(List<ClientScopeRepresentation> clientScopes) {
    List<ClientScopeRepresentation> existingClientScopes =
        getRealm().clientScopes().findAll().stream()
            .filter(scope -> !getIgnoredClientScopes().contains(scope.getName()))
            .toList();

    ClientScopeRepresentationDiffer clientScopeDiffer =
        getClientScopesDiffer(existingClientScopes, clientScopes);
    clientScopeDiffer.getElementsToAdd().forEach(this::addClientScope);
    clientScopeDiffer.getElementsToDelete().forEach(this::deleteClientScope);
    clientScopeDiffer
        .getElementsToUpdate()
        .forEach(
            toUpdate -> {
              updateClientScope(toUpdate);
              createOrUpdateProtocolMappers(
                  toUpdate.newState(),
                  findSourceScope(clientScopes, toUpdate.newState().getName()));
            });
    clientScopeDiffer
        .getElementsUnmodified()
        .forEach(
            scope ->
                createOrUpdateProtocolMappers(
                    scope, findSourceScope(clientScopes, scope.getName())));
  }

  void addClientScope(ClientScopeRepresentation clientScope) {
    log.info("Creating ClientScope '{}'", clientScope.getName());
    try (Response response = getRealm().clientScopes().create(clientScope)) {
      assertResponseIs201Created(response);
    }
  }

  void deleteClientScope(ClientScopeRepresentation clientScope) {
    log.info("Deleting ClientScope '{}'", clientScope.getName());
    getRealm().clientScopes().get(clientScope.getId()).remove();
  }

  void updateClientScope(ToUpdate<ClientScopeRepresentation> toUpdate) {
    ClientScopeRepresentation newClientScope = toUpdate.newState();
    log.info(
        "ClientScope '{}' already exists, but update is required:\n{}",
        newClientScope.getName(),
        toUpdate.multiLineDiff());
    getRealm().clientScopes().get(newClientScope.getId()).update(newClientScope);
  }

  public List<UserRepresentation> getUsers(int maxResults) {
    // getRealm().users().list() only returns 100 users per default
    return getRealm().users().list(null, maxResults);
  }

  public List<UserRepresentation> getUsersMarkedAsTemporaryAdmin() {
    return getRealm().users().searchByAttributes("is_temporary_admin:true");
  }

  private static ClientScopeRepresentation findSourceScope(
      List<ClientScopeRepresentation> sourceScopes, String name) {
    return sourceScopes.stream()
        .filter(scope -> StringUtils.equals(scope.getName(), name))
        .findFirst()
        .orElseThrow(
            () -> new IllegalStateException("No source scope with name '" + name + "' found"));
  }

  private void createOrUpdateProtocolMappers(
      ClientScopeRepresentation targetScope, ClientScopeRepresentation sourceScope) {
    List<ProtocolMapperRepresentation> targetMappers =
        ListUtils.emptyIfNull(targetScope.getProtocolMappers());
    List<ProtocolMapperRepresentation> sourceMappers =
        ListUtils.emptyIfNull(sourceScope.getProtocolMappers());
    ProtocolMapperDiffer mapperDiffer = new ProtocolMapperDiffer(targetMappers, sourceMappers);
    createProtocolMappers(targetScope, mapperDiffer.getElementsToAdd());
    mapperDiffer.getElementsToDelete().forEach(mapper -> deleteProtocolMapper(targetScope, mapper));
    mapperDiffer
        .getElementsToUpdate()
        .forEach(
            toUpdate ->
                updateProtocolMapper(targetScope, toUpdate.newState(), toUpdate.multiLineDiff()));
  }

  private void createProtocolMappers(
      ClientScopeRepresentation targetScope, List<ProtocolMapperRepresentation> elementsToAdd) {
    String mapperNames =
        elementsToAdd.stream()
            .map(ProtocolMapperRepresentation::getName)
            .collect(Collectors.joining(", "));
    if (!elementsToAdd.isEmpty()) {
      log.info(
          "Creating ProtocolMappers '{}' in ClientScope '{}'", mapperNames, targetScope.getName());
      getRealm()
          .clientScopes()
          .get(targetScope.getId())
          .getProtocolMappers()
          .createMapper(elementsToAdd);
    }
  }

  private void deleteProtocolMapper(
      ClientScopeRepresentation targetScope, ProtocolMapperRepresentation toDelete) {
    log.info(
        "Deleting ProtocolMapper '{}' from ClientScope '{}'",
        toDelete.getName(),
        targetScope.getName());
    getRealm()
        .clientScopes()
        .get(targetScope.getId())
        .getProtocolMappers()
        .delete(toDelete.getId());
  }

  private void updateProtocolMapper(
      ClientScopeRepresentation targetScope, ProtocolMapperRepresentation mapper, String diff) {
    log.info(
        "ProtocolMapper '{}' in ClientScope '{}' already exists, but update is required:\n{}",
        mapper.getName(),
        targetScope.getName(),
        diff);
    getRealm()
        .clientScopes()
        .get(targetScope.getId())
        .getProtocolMappers()
        .update(mapper.getId(), mapper);
  }

  protected static Stream<String> getUserSearchTarget(UserRepresentation user) {
    return Stream.of(user.getFirstName(), user.getLastName(), user.getUsername(), user.getEmail())
        .filter(Objects::nonNull)
        .map(EmployeeKeycloakClient::normalizedQueryTerm);
  }

  private CompletableFuture<List<UserRepresentation>> getRoleAndRoleGroupMembers(
      ExecutorService pool, String name, RolesResource roles) {
    return CompletableFuture.supplyAsync(
        () -> {
          RoleResource roleResource = roles.get(name);
          List<UserRepresentation> roleUserMembers = roleResource.getUserMembers();
          List<UserRepresentation> groupUserMembers =
              roleResource.getRoleGroupMembers().stream()
                  .map(GroupRepresentation::getId)
                  .map(this::getGroupResource)
                  .flatMap(group -> group.members().stream())
                  .toList();
          return ListUtils.union(roleUserMembers, groupUserMembers);
        },
        pool);
  }

  public List<RoleRepresentation> getSystemRoles() {
    return getRoles().stream()
        .filter(r -> r.getName().startsWith(KeycloakRole.SYSTEM_PREFIX))
        .toList();
  }

  public List<RoleRepresentation> getRoles() {
    return getRealm().roles().list().stream()
        .sorted(Comparator.comparing(RoleRepresentation::getName))
        .toList();
  }

  public List<GroupRepresentation> getGroupsWithRealmRoles() {
    List<GroupRepresentation> groups = getGroupsResource().groups();

    groups.forEach(
        group ->
            group.setRealmRoles(
                nullIfEmpty(
                    getGroupResource(group.getId()).roles().realmLevel().listAll().stream()
                        .map(RoleRepresentation::getName)
                        .sorted()
                        .toList())));
    return groups;
  }

  private List<String> nullIfEmpty(List<String> list) {
    return list.isEmpty() ? null : list;
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

  public void createOrUpdateDefaultRoleComposites(
      List<KeycloakRole> configuredDefaultRoleComposites) {
    RoleResource defaultRoleResource = getRoleResource(getDefaultRoleName());
    List<String> existingDefaultRoleCompositeNames =
        defaultRoleResource.getRealmRoleComposites().stream()
            .map(RoleRepresentation::getName)
            .filter(name -> name.startsWith(KeycloakRole.SYSTEM_PREFIX))
            .toList();

    List<String> configuredDefaultRoleCompositeNames =
        configuredDefaultRoleComposites.stream().map(KeycloakRole::getKeycloakName).toList();

    createOrUpdateRoleComposites(
        defaultRoleResource,
        existingDefaultRoleCompositeNames,
        configuredDefaultRoleCompositeNames);
  }

  private void createOrUpdateRoleComposites(
      RoleResource role,
      List<String> existingRoleCompositeNames,
      List<String> configuredRoleCompositeNames) {
    KeycloakDiffer<String> differ =
        getStringDiffer(
            existingRoleCompositeNames, configuredRoleCompositeNames.stream().sorted().toList());

    deleteRoleComposites(role, differ.getElementsToDelete());
    addRoleComposites(role, differ.getElementsToAdd());
  }

  private void addRoleComposites(RoleResource role, List<String> roleCompositesToAdd) {
    if (CollectionUtils.isNotEmpty(roleCompositesToAdd)) {
      log.info(
          "Adding composite roles '{}' to role {}",
          String.join(", ", roleCompositesToAdd),
          role.toRepresentation().getName());
      role.addComposites(roleCompositesToAdd.stream().map(this::getRoleByName).toList());
    }
  }

  private void deleteRoleComposites(RoleResource role, List<String> roleCompositesToDelete) {
    if (CollectionUtils.isNotEmpty(roleCompositesToDelete)) {
      log.info(
          "Removing composite roles '{}' from role {}",
          String.join(", ", roleCompositesToDelete),
          role.toRepresentation().getName());
      role.deleteComposites(roleCompositesToDelete.stream().map(this::getRoleByName).toList());
    }
  }

  public static Map<String, String> getClientRepresentationAttributes(
      Map<String, String> configuredAttributes) {
    Map<String, String> attributes = new LinkedHashMap<>();
    attributes.put("backchannel.logout.revoke.offline.tokens", FALSE);
    attributes.put("backchannel.logout.session.required", TRUE);
    attributes.put("realm_client", FALSE);
    attributes.putAll(configuredAttributes);
    return attributes;
  }

  private String getDefaultRoleName() {
    return "default-roles-" + realmName;
  }

  private sealed interface RealmDiffResult
      permits RealmDoesNotExist, RealmNotChanged, RealmChanged {}

  private record RealmDoesNotExist() implements RealmDiffResult {}

  private record RealmNotChanged() implements RealmDiffResult {}

  private record RealmChanged(RealmRepresentation newState, String diff)
      implements RealmDiffResult {}
}

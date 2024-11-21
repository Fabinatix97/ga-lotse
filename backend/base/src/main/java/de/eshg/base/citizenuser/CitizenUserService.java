/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser;

import com.google.common.collect.Iterables;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.keycloak.CitizenKeycloakClient;
import de.eshg.keycloak.api.user.KeycloakAttributes;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.mutex.MutexService;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class CitizenUserService {
  private static final Logger log = LoggerFactory.getLogger(CitizenUserService.class);

  public static final String ACCESS_CODE_USERNAME_PREFIX = "access-code-user-";
  private static final String MUTEX_ACCESS_CODE_USER_WRITE = "ACCESS_CODE_USER_WRITE";

  private final AuditLogger auditLogger;
  private final AccessCodeGenerator accessCodeGenerator;
  private final int maxAccessCodeGenerationTries;
  private final CitizenKeycloakClient citizenKeycloakClient;
  private final MutexService mutexService;
  private final boolean testHelperEnabled;
  private final EnvironmentConfig environmentConfig;

  public CitizenUserService(
      AuditLogger auditLogger,
      AccessCodeGenerator accessCodeGenerator,
      @Value("${eshg.access-code-generator.max-tries:5}") int maxAccessCodeGenerationTries,
      CitizenKeycloakClient citizenKeycloakClient,
      MutexService mutexService,
      Environment environment,
      EnvironmentConfig environmentConfig) {
    this.auditLogger = auditLogger;
    this.accessCodeGenerator = accessCodeGenerator;
    this.maxAccessCodeGenerationTries = maxAccessCodeGenerationTries;
    this.citizenKeycloakClient = citizenKeycloakClient;
    this.mutexService = mutexService;
    this.environmentConfig = environmentConfig;
    this.testHelperEnabled =
        Arrays.asList(environment.getActiveProfiles())
            .contains(ConditionalOnTestHelperEnabled.TEST_HELPER_PROFILE_NAME);
    if (this.testHelperEnabled) {
      log.warn("Test-helper profile detected: Will provision passwords for citizen users!");
    }
  }

  public UserRepresentation getUserByIdOrThrow(UUID userId) {
    try {
      return citizenKeycloakClient.getUserResource(userId.toString()).toRepresentation();
    } catch (jakarta.ws.rs.NotFoundException e) {
      throw new NotFoundException("User not found");
    }
  }

  public List<String> getUserKeycloakRoles() {
    return citizenKeycloakClient.getSelfUser().roles().realmLevel().listEffective().stream()
        .map(RoleRepresentation::getName)
        .toList();
  }

  public UserRepresentation addAccessCodeUser(LocalDate dateOfBirth) {
    return mutexService.doWithLockedMutex(
        MUTEX_ACCESS_CODE_USER_WRITE, () -> addAccessCodeUserWhenLocked(dateOfBirth));
  }

  private UserRepresentation addAccessCodeUserWhenLocked(LocalDate dateOfBirth) {
    UserResource user =
        citizenKeycloakClient.createUser(getUserRepresentation(getUniqueAccessCode(), dateOfBirth));
    user.roles().realmLevel().add(List.of(getAccessCodeUserRole()));

    UserRepresentation representation = user.toRepresentation(true);
    auditLogger.log(
        "Benutzerverwaltung Zugangscode",
        "Hinzufügen Benutzer",
        Map.of(
            "Benutzer ID", representation.getId(),
            "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-")));
    return representation;
  }

  private String getUniqueAccessCode() {
    for (int i = 1; i <= maxAccessCodeGenerationTries; i++) {
      String accessCode = accessCodeGenerator.generateAccessCode();
      Optional<UserRepresentation> existingUser = getUserByAccessCode(accessCode);
      if (existingUser.isEmpty()) {
        return accessCode;
      } else {
        logDuplicateAccessCode(accessCode, existingUser.get(), i);
      }
    }
    throw new IllegalStateException(
        "Could not generate unique access code in %s tries"
            .formatted(maxAccessCodeGenerationTries));
  }

  private RoleRepresentation getAccessCodeUserRole() {
    return citizenKeycloakClient
        .getRealm()
        .roles()
        .get(CitizenPermissionRole.ACCESS_CODE_USER.getKeycloakName())
        .toRepresentation();
  }

  private Optional<UserRepresentation> getUserByAccessCode(String accessCode) {
    String accessCodeSearchQuery =
        "%s:%s".formatted(KeycloakAttributes.ACCESS_CODE_ATTRIBUTE, accessCode);
    return citizenKeycloakClient
        .getRealm()
        .users()
        .searchByAttributes(accessCodeSearchQuery)
        .stream()
        .collect(StreamUtil.toSingleOptionalElement());
  }

  private void logDuplicateAccessCode(
      String accessCode, UserRepresentation existingUser, int tryNumber) {
    log.info(
        "User (id = {}) with accessCode {} already exists (Try {})",
        existingUser.getId(),
        accessCode,
        tryNumber);
  }

  private UserRepresentation getUserRepresentation(String accessCode, LocalDate dateOfBirth) {
    UserRepresentation user = new UserRepresentation();
    user.setUsername(ACCESS_CODE_USERNAME_PREFIX + UUID.randomUUID());
    user.setEnabled(true);
    user.setEmailVerified(true);
    Map<String, List<String>> attributes = new LinkedHashMap<>();
    attributes.put(KeycloakAttributes.ACCESS_CODE_ATTRIBUTE, List.of(accessCode));
    String formattedDateOfBirth = dateOfBirth.format(DateTimeFormatter.ISO_LOCAL_DATE);
    attributes.put(KeycloakAttributes.DATE_OF_BIRTH_ATTRIBUTE, List.of(formattedDateOfBirth));
    if (testHelperEnabled) {
      environmentConfig.assertIsNotProduction();
      log.warn("Provisioning password for citizen user since test-helper profile is enabled!");
      setPasswordCredentials(accessCode, formattedDateOfBirth, user);
    }
    user.setAttributes(attributes);
    return user;
  }

  private static void setPasswordCredentials(
      String accessCode, String formattedDateOfBirth, UserRepresentation user) {
    CredentialRepresentation passwordCredentials = new CredentialRepresentation();
    passwordCredentials.setType(CredentialRepresentation.PASSWORD);
    passwordCredentials.setValue(mapToPassword(accessCode, formattedDateOfBirth));
    passwordCredentials.setTemporary(false);
    user.setCredentials(List.of(passwordCredentials));
  }

  private static String mapToPassword(String accessCode, String formattedDateOfBirth) {
    return accessCode + " " + formattedDateOfBirth;
  }

  public String getPasswordOfAccessCodeUser(UserRepresentation user) {
    environmentConfig.assertIsNotProduction();
    Assert.isTrue(
        testHelperEnabled, "This must not be invoked when the test-helper is not enabled");
    Assert.isTrue(
        user.getUsername().startsWith(ACCESS_CODE_USERNAME_PREFIX), "Unexpected username");

    Map<String, List<String>> attributes = user.getAttributes();
    String accessCode =
        Iterables.getOnlyElement(attributes.get(KeycloakAttributes.ACCESS_CODE_ATTRIBUTE));
    String formattedDateOfBirth =
        Iterables.getOnlyElement(attributes.get(KeycloakAttributes.DATE_OF_BIRTH_ATTRIBUTE));
    return mapToPassword(accessCode, formattedDateOfBirth);
  }

  public void deleteAccessCodeUser(UUID userId) {
    UserResource userResource = getAccessCodeUserByIdOrThrow(userId);
    userResource.remove();
  }

  public UserResource getAccessCodeUserByIdOrThrow(UUID userId) {
    try {
      UserResource userResource = citizenKeycloakClient.getUserResource(userId.toString());
      validateAccessCodeUser(userResource);
      return userResource;
    } catch (jakarta.ws.rs.NotFoundException e) {
      throw new NotFoundException("Access code user not found");
    }
  }

  private void validateAccessCodeUser(UserResource userResource) {
    Map<String, List<String>> attributes = userResource.toRepresentation().getAttributes();
    if (attributes == null || attributes.get(KeycloakAttributes.ACCESS_CODE_ATTRIBUTE).isEmpty()) {
      throw new BadRequestException("Requested user is no access code user");
    }
  }

  public UserRepresentation addAnonymousUser(String pin) {
    return mutexService.doWithLockedMutex(
        MUTEX_ACCESS_CODE_USER_WRITE, () -> addAnonymousUserWhenLocked(pin));
  }

  private UserRepresentation addAnonymousUserWhenLocked(String pin) {
    UserResource user = citizenKeycloakClient.createUser(getAnonymousUserRepresentation(pin));
    user.roles().realmLevel().add(List.of(getAccessCodeUserRole()));

    UserRepresentation representation = user.toRepresentation(true);
    auditLogger.log(
        "Benutzerverwaltung Zugangscode",
        "Hinzufügen anonymer Benutzer",
        Map.of(
            "Benutzer ID", representation.getId(),
            "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-")));
    return representation;
  }

  private UserRepresentation getAnonymousUserRepresentation(String pin) {
    CredentialRepresentation passwordCredentials = new CredentialRepresentation();
    passwordCredentials.setType(CredentialRepresentation.PASSWORD);
    passwordCredentials.setValue(pin);
    passwordCredentials.setTemporary(false);

    String accessCode = getUniqueAccessCode();
    UserRepresentation rep =
        new UserRepresentation()
            .singleAttribute(KeycloakAttributes.ANONYMOUS_USER_ATTRIBUTE, "true")
            .singleAttribute(KeycloakAttributes.ACCESS_CODE_ATTRIBUTE, accessCode);
    rep.setUsername(accessCode);
    rep.setEnabled(true);
    rep.setEmailVerified(true);
    rep.setCredentials(List.of(passwordCredentials));
    return rep;
  }

  public void deleteAnonymousUser(UUID userId) {
    try {
      UserResource user = citizenKeycloakClient.getUserResource(userId.toString());
      UserRepresentation rep = user.toRepresentation();
      if (Boolean.parseBoolean(rep.firstAttribute(KeycloakAttributes.ANONYMOUS_USER_ATTRIBUTE))) {
        throw new BadRequestException("Requested user is not anonymous");
      }
      user.remove();
    } catch (jakarta.ws.rs.NotFoundException e) {
      throw new NotFoundException("Anonymous access code user not found");
    }
  }

  public void verifyAnonymousUserPin(UUID userId, String pin) {
    citizenKeycloakClient.verifyAnonymousUserPin(userId, pin);
  }
}

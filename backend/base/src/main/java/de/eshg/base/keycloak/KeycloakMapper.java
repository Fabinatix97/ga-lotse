/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.EmployeeUserAttribute.AUDIT_LOG_CRYPTO_VERSION;
import static de.eshg.base.keycloak.EmployeeUserAttribute.AUDIT_LOG_ENCRYPTED_PRIVATE_KEY;
import static de.eshg.base.keycloak.EmployeeUserAttribute.AUDIT_LOG_KEY_IDENTIFIER;
import static de.eshg.base.keycloak.EmployeeUserAttribute.AUDIT_LOG_PUBLIC_KEY;

import de.eshg.base.user.model.EmployeeUserKeys;
import de.eshg.base.user.model.PrivateEmployeeUserKey;
import de.eshg.base.user.model.PublicEmployeeUserKey;
import de.eshg.keycloak.api.user.model.KeycloakApiUserDto;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.keycloak.KeycloakGroup;
import de.eshg.lib.keycloak.KeycloakRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.lang3.ArrayUtils;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.util.CollectionUtils;

public class KeycloakMapper {

  private KeycloakMapper() {
    throw new UnsupportedOperationException("Util class");
  }

  public static List<GroupRepresentation> map(KeycloakGroup... values) {
    return Arrays.stream(values).map(KeycloakMapper::mapGroup).toList();
  }

  static GroupRepresentation mapGroup(KeycloakGroup keycloakGroup) {
    GroupRepresentation group = new GroupRepresentation();
    group.setName(keycloakGroup.getKeycloakName());

    group.setRealmRoles(mapGroupRoles(keycloakGroup.roles()));

    return group;
  }

  private static List<String> mapGroupRoles(Collection<? extends KeycloakRole> roles) {
    if (CollectionUtils.isEmpty(roles)) {
      return Collections.emptyList();
    }
    return roles.stream().map(KeycloakRole::getKeycloakName).toList();
  }

  public static List<ModuleMemberGroup> mapModulesToGroups(List<BusinessModule> modules) {
    return modules.stream().map(KeycloakMapper::mapModuleToGroup).toList();
  }

  private static ModuleMemberGroup mapModuleToGroup(BusinessModule module) {
    return switch (module) {
      case INSPECTION -> ModuleMemberGroup.INSPECTION;
      case SCHOOL_ENTRY -> ModuleMemberGroup.SCHOOL_ENTRY;
      case TRAVEL_MEDICINE -> ModuleMemberGroup.TRAVEL_MEDICINE;
      case MEASLES_PROTECTION -> ModuleMemberGroup.MEASLES_PROTECTION;
      case STI_PROTECTION -> ModuleMemberGroup.STI_PROTECTION;
    };
  }

  public static void mapEmployeeUserKeysIntoUserRepresentation(
      EmployeeUserKeys userKeys, UserRepresentation selfUserRepresentation) {
    selfUserRepresentation.singleAttribute(
        AUDIT_LOG_ENCRYPTED_PRIVATE_KEY.getKey(), base64Encode(userKeys.encryptedPrivateKey()));
    selfUserRepresentation.singleAttribute(
        AUDIT_LOG_PUBLIC_KEY.getKey(), base64Encode(userKeys.publicKey()));
    selfUserRepresentation.singleAttribute(
        AUDIT_LOG_CRYPTO_VERSION.getKey(), String.valueOf(userKeys.cryptoVersion()));
    selfUserRepresentation.singleAttribute(
        AUDIT_LOG_KEY_IDENTIFIER.getKey(), userKeys.keyIdentifier());
  }

  public static EmployeeUserKeys mapUserRepresentationToEmployeeUserKeys(
      UserRepresentation userRepresentation) {
    List<Byte> encryptedPrivateKey = extractPrivateKey(userRepresentation);
    List<Byte> publicKey = extractPublicKey(userRepresentation);
    int cryptoVersion = extractCryptoVersion(userRepresentation);
    String keyIdentifier = extractKeyIdentifier(userRepresentation);

    return new EmployeeUserKeys(encryptedPrivateKey, publicKey, cryptoVersion, keyIdentifier);
  }

  public static PublicEmployeeUserKey mapUserRepresentationToPublicUserKey(
      UserRepresentation userRepresentation) {
    List<Byte> publicKey = extractPublicKey(userRepresentation);
    String keyIdentifier = extractKeyIdentifier(userRepresentation);
    int cryptoVersion = extractCryptoVersion(userRepresentation);

    return new PublicEmployeeUserKey(
        UUID.fromString(userRepresentation.getId()), publicKey, cryptoVersion, keyIdentifier);
  }

  public static PublicEmployeeUserKey mapKeycloakApiUserToPublicUserKey(KeycloakApiUserDto user) {
    UserRepresentation userRepresentation = new UserRepresentation();
    userRepresentation.setAttributes(user.attributes());
    userRepresentation.setId(user.id().toString());
    return mapUserRepresentationToPublicUserKey(userRepresentation);
  }

  public static PrivateEmployeeUserKey mapUserRepresentationToPrivateEmployeeUserKey(
      UserRepresentation userRepresentation) {
    List<Byte> privateKey = extractPrivateKey(userRepresentation);
    String keyIdentifier = extractKeyIdentifier(userRepresentation);
    int cryptoVersion = extractCryptoVersion(userRepresentation);
    return new PrivateEmployeeUserKey(privateKey, cryptoVersion, keyIdentifier);
  }

  private static List<Byte> extractPrivateKey(UserRepresentation userRepresentation) {
    return base64Decode(
        userRepresentation.firstAttribute(AUDIT_LOG_ENCRYPTED_PRIVATE_KEY.getKey()));
  }

  private static List<Byte> extractPublicKey(UserRepresentation userRepresentation) {
    return base64Decode(userRepresentation.firstAttribute(AUDIT_LOG_PUBLIC_KEY.getKey()));
  }

  private static int extractCryptoVersion(UserRepresentation userRepresentation) {
    return Integer.parseInt(userRepresentation.firstAttribute(AUDIT_LOG_CRYPTO_VERSION.getKey()));
  }

  private static String extractKeyIdentifier(UserRepresentation userRepresentation) {
    return userRepresentation.firstAttribute(AUDIT_LOG_KEY_IDENTIFIER.getKey());
  }

  private static List<Byte> base64Decode(String base64String) {
    return List.of(ArrayUtils.toObject(Base64.getDecoder().decode(base64String)));
  }

  private static String base64Encode(List<Byte> bytes) {
    return Base64.getEncoder().encodeToString(ArrayUtils.toPrimitive(bytes.toArray(Byte[]::new)));
  }

  public static Map<String, String> mapSmtpServer(KeycloakProperties.Smtp smtp) {
    return Map.of(
        "from",
        smtp.from(),
        "host",
        smtp.host(),
        "port",
        String.valueOf(smtp.port()),
        "auth",
        "true",
        "ssl",
        String.valueOf(smtp.sslEnabled()),
        "user",
        smtp.username(),
        "password",
        smtp.password());
  }
}

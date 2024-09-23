/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.mapper;

import de.eshg.base.calendar.api.DetailedEventWithoutCalendarId;
import de.eshg.base.keycloak.EmployeeUserAttribute;
import de.eshg.base.keycloak.KeycloakEventType;
import de.eshg.base.keycloak.RealmBoundKeycloakClient;
import de.eshg.base.user.api.AddUserRequest;
import de.eshg.base.user.api.EmployeeUserKeysDto;
import de.eshg.base.user.api.GroupMemberDto;
import de.eshg.base.user.api.PrivateEmployeeUserKeyDto;
import de.eshg.base.user.api.PublicEmployeeUserKeyDto;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.user.api.UserEventDto;
import de.eshg.base.user.api.UserEventTypeDto;
import de.eshg.base.user.api.UserGroupDto;
import de.eshg.base.user.api.UserProfileDto;
import de.eshg.base.user.api.UserRoleDto;
import de.eshg.base.user.model.EmployeeUserKeys;
import de.eshg.base.user.model.PrivateEmployeeUserKey;
import de.eshg.base.user.model.PublicEmployeeUserKey;
import de.eshg.base.util.KeycloakUtil;
import de.eshg.keycloak.api.user.model.KeycloakApiGroupMemberDto;
import de.eshg.keycloak.api.user.model.KeycloakApiUserDto;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.KeycloakRole;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.keycloak.representations.idm.EventRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

public class UserMapper {

  private UserMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static UserRepresentation mapUserToDm(AddUserRequest user) {
    UserRepresentation representation = new UserRepresentation();
    representation.setEmail(user.email());
    representation.setUsername(user.username());
    representation.setFirstName(user.firstName());
    representation.setLastName(user.lastName());
    representation.setGroups(user.groups());
    representation.setAttributes(
        mapAttributesToDm(user.phoneNumber(), user.externalChatUsername()));
    return representation;
  }

  private static Optional<String> getUserAttribute(
      Map<String, List<String>> attributes, EmployeeUserAttribute attribute) {
    return KeycloakUtil.getUserAttribute(attributes, attribute.getKey());
  }

  public static UserDto mapUserToApi(UserRepresentation user) {
    return new UserDto(
        UUID.fromString(user.getId()),
        user.getUsername(),
        user.getEmail(),
        getUserAttribute(user.getAttributes(), EmployeeUserAttribute.PHONE_NUMBER).orElse(null),
        getUserAttribute(user.getAttributes(), EmployeeUserAttribute.EXTERNAL_CHAT_USERNAME)
            .orElse(null),
        user.getFirstName(),
        user.getLastName(),
        user.isEnabled());
  }

  public static UserProfileDto mapUserProfileToApi(
      UserRepresentation user, List<String> groups, List<DetailedEventWithoutCalendarId> events) {
    return new UserProfileDto(
        mapUserToApi(user),
        RealmBoundKeycloakClient.getSelfUserId().equals(user.getId()),
        groups.stream().sorted().map(UserGroupDto::new).toList(),
        events);
  }

  public static UserDto mapUserToApi(KeycloakApiUserDto user) {
    return new UserDto(
        user.id(),
        user.username(),
        user.email(),
        getUserAttribute(user.attributes(), EmployeeUserAttribute.PHONE_NUMBER).orElse(null),
        getUserAttribute(user.attributes(), EmployeeUserAttribute.EXTERNAL_CHAT_USERNAME)
            .orElse(null),
        user.firstName(),
        user.lastName(),
        user.enabled());
  }

  public static GroupMemberDto mapGroupMemberToApi(KeycloakApiGroupMemberDto groupMember) {
    return new GroupMemberDto(groupMember.groupNames(), mapUserToApi(groupMember.user()));
  }

  public static KeycloakRole mapRoleToDm(UserRoleDto role) {
    return switch (role) {
      case INSPECTION_LEADER -> EmployeePermissionRole.INSPECTION_LEADER;
      case INSPECTION_LANDESAMT_LEADER -> EmployeePermissionRole.INSPECTION_LANDESAMT_LEADER;
      case SCHOOL_ENTRY_LEADER -> EmployeePermissionRole.SCHOOL_ENTRY_LEADER;
      case TRAVEL_MEDICINE_LEADER -> EmployeePermissionRole.TRAVEL_MEDICINE_LEADER;
      case MEASLES_PROTECTION_LEADER -> EmployeePermissionRole.MEASLES_PROTECTION_LEADER;
      case STATISTICS_LEADER -> EmployeePermissionRole.STATISTICS_LEADER;
      case BASE_PERSONS_READ -> EmployeePermissionRole.BASE_PERSONS_READ;
      case BASE_PERSONS_WRITE -> EmployeePermissionRole.BASE_PERSONS_WRITE;
      case BASE_PERSONS_DELETE -> EmployeePermissionRole.BASE_PERSONS_DELETE;
      case BASE_FACILITIES_READ -> EmployeePermissionRole.BASE_FACILITIES_READ;
      case BASE_FACILITIES_WRITE -> EmployeePermissionRole.BASE_FACILITIES_WRITE;
      case BASE_FACILITIES_DELETE -> EmployeePermissionRole.BASE_FACILITIES_DELETE;
      case BASE_RESOURCES_READ -> EmployeePermissionRole.BASE_RESOURCES_READ;
      case BASE_RESOURCES_WRITE -> EmployeePermissionRole.BASE_RESOURCES_WRITE;
      case BASE_INVENTORY_READ -> EmployeePermissionRole.BASE_INVENTORY_READ;
      case BASE_INVENTORY_USE -> EmployeePermissionRole.BASE_INVENTORY_USE;
      case BASE_INVENTORY_ADMINISTRATE -> EmployeePermissionRole.BASE_INVENTORY_ADMINISTRATE;
      case BASE_LABELS_READ -> EmployeePermissionRole.BASE_LABELS_READ;
      case BASE_LABELS_WRITE -> EmployeePermissionRole.BASE_LABELS_WRITE;
      case BASE_CONTACTS_READ -> EmployeePermissionRole.BASE_CONTACTS_READ;
      case BASE_CONTACTS_WRITE -> EmployeePermissionRole.BASE_CONTACTS_WRITE;
      case BASE_GDPR_PROCEDURE_READ -> EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ;
      case BASE_GDPR_PROCEDURE_WRITE -> EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE;
      case BASE_GLOBAL_CALENDARS_WRITE -> EmployeePermissionRole.BASE_GLOBAL_CALENDARS_WRITE;
      case BASE_CALENDAR_BUSINESS_EVENTS_WRITE ->
          EmployeePermissionRole.BASE_CALENDAR_BUSINESS_EVENTS_WRITE;
      case BASE_PROCEDURES_READ -> EmployeePermissionRole.BASE_PROCEDURES_READ;
      case BASE_PROCEDURE_METRICS_READ -> EmployeePermissionRole.BASE_PROCEDURE_METRICS_READ;
      case BASE_TASKS_READ -> EmployeePermissionRole.BASE_TASKS_READ;
      case BASE_ACCESS_CODE_USER_ADMIN -> EmployeePermissionRole.BASE_ACCESS_CODE_USER_ADMIN;
      case SCHOOL_ENTRY_ADMIN -> EmployeePermissionRole.SCHOOL_ENTRY_ADMIN;
      case INSPECTION_NOTIFICATIONS_READ -> EmployeePermissionRole.INSPECTION_NOTIFICATIONS_READ;
      case INSPECTION_PROCEDURE_EDIT -> EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT;
      case INSPECTION_PROCEDURE_ASSIGN -> EmployeePermissionRole.INSPECTION_PROCEDURE_ASSIGN;
      case INSPECTION_OBJECTTYPES_READ -> EmployeePermissionRole.INSPECTION_OBJECTTYPES_READ;
      case INSPECTION_OBJECTTYPES_WRITE -> EmployeePermissionRole.INSPECTION_OBJECTTYPES_WRITE;
      case INSPECTION_CHECKLISTDEFINITIONS_READ ->
          EmployeePermissionRole.INSPECTION_CHECKLISTDEFINITIONS_READ;
      case INSPECTION_CHECKLISTDEFINITIONS_WRITE ->
          EmployeePermissionRole.INSPECTION_CHECKLISTDEFINITIONS_WRITE;
      case INSPECTION_CORECHECKLISTDEFINITIONS_EDIT ->
          EmployeePermissionRole.INSPECTION_CORECHECKLISTDEFINITIONS_EDIT;
      case INSPECTION_CENTRALREPOSITORY_READ ->
          EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_READ;
      case INSPECTION_CENTRALREPOSITORY_WRITE ->
          EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_WRITE;
      case INSPECTION_CENTRALREPOSITORY_DELETE ->
          EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_DELETE;
      case INSPECTION_CENTRALREPOSITORY_WRITE_CORECHECKLISTS ->
          EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_WRITE_CORECHECKLISTS;
      case TRAVEL_MEDICINE_ADMIN -> EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN;
      case MEASLES_PROTECTION_ADMIN -> EmployeePermissionRole.MEASLES_PROTECTION_ADMIN;
      case CHAT_MANAGEMENT_WRITE -> EmployeePermissionRole.CHAT_MANAGEMENT_WRITE;
      case STATISTICS_STATISTICS_READ -> EmployeePermissionRole.STATISTICS_STATISTICS_READ;
      case STATISTICS_STATISTICS_WRITE -> EmployeePermissionRole.STATISTICS_STATISTICS_WRITE;
      case STATISTICS_STATISTICS_ADMIN -> EmployeePermissionRole.STATISTICS_STATISTICS_ADMIN;
      case BASE_MAIL_SEND -> EmployeePermissionRole.BASE_MAIL_SEND;
      case INBOX_PROCEDURE_WRITE -> EmployeePermissionRole.INBOX_PROCEDURE_WRITE;
      case PROCEDURE_ARCHIVE -> EmployeePermissionRole.PROCEDURE_ARCHIVE;
      case PROCEDURE_ARCHIVE_ADMIN -> EmployeePermissionRole.PROCEDURE_ARCHIVE_ADMIN;
      case AUDITLOG_FILE_SEND -> EmployeePermissionRole.AUDITLOG_FILE_SEND;
      case AUDITLOG_DECRYPT_AND_ACCESS -> EmployeePermissionRole.AUDITLOG_DECRYPT_AND_ACCESS;
      case AUDITLOG_AUTHORIZE_ACCESS -> EmployeePermissionRole.AUDITLOG_AUTHORIZE_ACCESS;
      case AUDITLOG_PUBLIC_KEYS_READ -> EmployeePermissionRole.AUDITLOG_PUBLIC_KEYS_READ;
      case STANDARD_EMPLOYEE -> EmployeePermissionRole.STANDARD_EMPLOYEE;
      case STI_PROTECTION_USER -> EmployeePermissionRole.STI_PROTECTION_USER;
      case STI_PROTECTION_MFA -> EmployeePermissionRole.STI_PROTECTION_MFA;
      case STI_PROTECTION_CONSULTANT -> EmployeePermissionRole.STI_PROTECTION_CONSULTANT;
      case STI_PROTECTION_PHYSICIAN -> EmployeePermissionRole.STI_PROTECTION_PHYSICIAN;
      case STI_PROTECTION_ADMIN -> EmployeePermissionRole.STI_PROTECTION_ADMIN;
      case STI_PROTECTION_LEADER -> EmployeePermissionRole.STI_PROTECTION_LEADER;
    };
  }

  private static UserRoleDto mapPermissionRoleToApi(EmployeePermissionRole role) {
    return switch (role) {
      case INSPECTION_LEADER -> UserRoleDto.INSPECTION_LEADER;
      case INSPECTION_LANDESAMT_LEADER -> UserRoleDto.INSPECTION_LANDESAMT_LEADER;
      case SCHOOL_ENTRY_LEADER -> UserRoleDto.SCHOOL_ENTRY_LEADER;
      case TRAVEL_MEDICINE_LEADER -> UserRoleDto.TRAVEL_MEDICINE_LEADER;
      case MEASLES_PROTECTION_LEADER -> UserRoleDto.MEASLES_PROTECTION_LEADER;
      case STATISTICS_LEADER -> UserRoleDto.STATISTICS_LEADER;
      case BASE_PERSONS_READ -> UserRoleDto.BASE_PERSONS_READ;
      case BASE_PERSONS_WRITE -> UserRoleDto.BASE_PERSONS_WRITE;
      case BASE_PERSONS_DELETE -> UserRoleDto.BASE_PERSONS_DELETE;
      case BASE_FACILITIES_READ -> UserRoleDto.BASE_FACILITIES_READ;
      case BASE_FACILITIES_WRITE -> UserRoleDto.BASE_FACILITIES_WRITE;
      case BASE_FACILITIES_DELETE -> UserRoleDto.BASE_FACILITIES_DELETE;
      case BASE_RESOURCES_READ -> UserRoleDto.BASE_RESOURCES_READ;
      case BASE_RESOURCES_WRITE -> UserRoleDto.BASE_RESOURCES_WRITE;
      case BASE_INVENTORY_READ -> UserRoleDto.BASE_INVENTORY_READ;
      case BASE_INVENTORY_USE -> UserRoleDto.BASE_INVENTORY_USE;
      case BASE_INVENTORY_ADMINISTRATE -> UserRoleDto.BASE_INVENTORY_ADMINISTRATE;
      case BASE_LABELS_READ -> UserRoleDto.BASE_LABELS_READ;
      case BASE_LABELS_WRITE -> UserRoleDto.BASE_LABELS_WRITE;
      case BASE_CONTACTS_READ -> UserRoleDto.BASE_CONTACTS_READ;
      case BASE_CONTACTS_WRITE -> UserRoleDto.BASE_CONTACTS_WRITE;
      case BASE_GDPR_PROCEDURE_READ -> UserRoleDto.BASE_GDPR_PROCEDURE_READ;
      case BASE_GDPR_PROCEDURE_WRITE -> UserRoleDto.BASE_GDPR_PROCEDURE_WRITE;
      case BASE_MAIL_SEND -> UserRoleDto.BASE_MAIL_SEND;
      case BASE_GLOBAL_CALENDARS_WRITE -> UserRoleDto.BASE_GLOBAL_CALENDARS_WRITE;
      case BASE_CALENDAR_BUSINESS_EVENTS_WRITE -> UserRoleDto.BASE_CALENDAR_BUSINESS_EVENTS_WRITE;
      case BASE_PROCEDURES_READ -> UserRoleDto.BASE_PROCEDURES_READ;
      case BASE_PROCEDURE_METRICS_READ -> UserRoleDto.BASE_PROCEDURE_METRICS_READ;
      case BASE_TASKS_READ -> UserRoleDto.BASE_TASKS_READ;
      case BASE_ACCESS_CODE_USER_ADMIN -> UserRoleDto.BASE_ACCESS_CODE_USER_ADMIN;
      case STATISTICS_STATISTICS_READ -> UserRoleDto.STATISTICS_STATISTICS_READ;
      case STATISTICS_STATISTICS_WRITE -> UserRoleDto.STATISTICS_STATISTICS_WRITE;
      case STATISTICS_STATISTICS_ADMIN -> UserRoleDto.STATISTICS_STATISTICS_ADMIN;
      case SCHOOL_ENTRY_ADMIN -> UserRoleDto.SCHOOL_ENTRY_ADMIN;
      case AUDITLOG_FILE_SEND -> UserRoleDto.AUDITLOG_FILE_SEND;
      case AUDITLOG_DECRYPT_AND_ACCESS -> UserRoleDto.AUDITLOG_DECRYPT_AND_ACCESS;
      case AUDITLOG_AUTHORIZE_ACCESS -> UserRoleDto.AUDITLOG_AUTHORIZE_ACCESS;
      case AUDITLOG_PUBLIC_KEYS_READ -> UserRoleDto.AUDITLOG_PUBLIC_KEYS_READ;
      case INSPECTION_NOTIFICATIONS_READ -> UserRoleDto.INSPECTION_NOTIFICATIONS_READ;
      case INSPECTION_PROCEDURE_EDIT -> UserRoleDto.INSPECTION_PROCEDURE_EDIT;
      case INSPECTION_PROCEDURE_ASSIGN -> UserRoleDto.INSPECTION_PROCEDURE_ASSIGN;
      case INSPECTION_OBJECTTYPES_READ -> UserRoleDto.INSPECTION_OBJECTTYPES_READ;
      case INSPECTION_OBJECTTYPES_WRITE -> UserRoleDto.INSPECTION_OBJECTTYPES_WRITE;
      case INSPECTION_CHECKLISTDEFINITIONS_READ -> UserRoleDto.INSPECTION_CHECKLISTDEFINITIONS_READ;
      case INSPECTION_CHECKLISTDEFINITIONS_WRITE ->
          UserRoleDto.INSPECTION_CHECKLISTDEFINITIONS_WRITE;
      case INSPECTION_CORECHECKLISTDEFINITIONS_EDIT ->
          UserRoleDto.INSPECTION_CORECHECKLISTDEFINITIONS_EDIT;
      case INSPECTION_CENTRALREPOSITORY_READ -> UserRoleDto.INSPECTION_CENTRALREPOSITORY_READ;
      case INSPECTION_CENTRALREPOSITORY_WRITE -> UserRoleDto.INSPECTION_CENTRALREPOSITORY_WRITE;
      case INSPECTION_CENTRALREPOSITORY_DELETE -> UserRoleDto.INSPECTION_CENTRALREPOSITORY_DELETE;
      case INSPECTION_CENTRALREPOSITORY_WRITE_CORECHECKLISTS ->
          UserRoleDto.INSPECTION_CENTRALREPOSITORY_WRITE_CORECHECKLISTS;
      case TRAVEL_MEDICINE_ADMIN -> UserRoleDto.TRAVEL_MEDICINE_ADMIN;
      case MEASLES_PROTECTION_ADMIN -> UserRoleDto.MEASLES_PROTECTION_ADMIN;
      case CHAT_MANAGEMENT_WRITE -> UserRoleDto.CHAT_MANAGEMENT_WRITE;
      case INBOX_PROCEDURE_WRITE -> UserRoleDto.INBOX_PROCEDURE_WRITE;
      case PROCEDURE_ARCHIVE -> UserRoleDto.PROCEDURE_ARCHIVE;
      case PROCEDURE_ARCHIVE_ADMIN -> UserRoleDto.PROCEDURE_ARCHIVE_ADMIN;
      case STANDARD_EMPLOYEE -> UserRoleDto.STANDARD_EMPLOYEE;
      case STI_PROTECTION_USER -> UserRoleDto.STI_PROTECTION_USER;
      case STI_PROTECTION_MFA -> UserRoleDto.STI_PROTECTION_MFA;
      case STI_PROTECTION_CONSULTANT -> UserRoleDto.STI_PROTECTION_CONSULTANT;
      case STI_PROTECTION_PHYSICIAN -> UserRoleDto.STI_PROTECTION_PHYSICIAN;
      case STI_PROTECTION_ADMIN -> UserRoleDto.STI_PROTECTION_ADMIN;
      case STI_PROTECTION_LEADER -> UserRoleDto.STI_PROTECTION_LEADER;
    };
  }

  public static Optional<UserRoleDto> mapKeycloakRoleToApi(String roleName) {
    return Arrays.stream(EmployeePermissionRole.values())
        .filter(role -> role.getKeycloakName().equals(roleName))
        .map(UserMapper::mapPermissionRoleToApi)
        .findFirst();
  }

  public static Map<String, List<String>> mapAttributesToDm(
      String phoneNumber, String externalChatUsername) {
    Map<String, List<String>> attributes = new HashMap<>();
    if (phoneNumber != null) {
      attributes.put(EmployeeUserAttribute.PHONE_NUMBER.getKey(), List.of(phoneNumber));
    }
    if (externalChatUsername != null) {
      attributes.put(
          EmployeeUserAttribute.EXTERNAL_CHAT_USERNAME.getKey(), List.of(externalChatUsername));
    }
    return attributes;
  }

  public static EmployeeUserKeys mapUserKeysToDm(EmployeeUserKeysDto employeeUserKeys) {
    return new EmployeeUserKeys(
        employeeUserKeys.encryptedPrivateKey(),
        employeeUserKeys.publicKey(),
        employeeUserKeys.cryptoVersion(),
        employeeUserKeys.keyIdentifier());
  }

  public static EmployeeUserKeysDto mapUserKeysToApi(EmployeeUserKeys employeeUserKeys) {
    return new EmployeeUserKeysDto(
        employeeUserKeys.encryptedPrivateKey(),
        employeeUserKeys.publicKey(),
        employeeUserKeys.cryptoVersion(),
        employeeUserKeys.keyIdentifier());
  }

  public static PublicEmployeeUserKeyDto mapPublicUserKeysToApi(
      PublicEmployeeUserKey publicEmployeeUserKeys) {
    return new PublicEmployeeUserKeyDto(
        publicEmployeeUserKeys.userId(),
        publicEmployeeUserKeys.publicKey(),
        publicEmployeeUserKeys.cryptoVersion(),
        publicEmployeeUserKeys.keyIdentifier());
  }

  public static PrivateEmployeeUserKeyDto mapPrivateUserKeyToApi(
      PrivateEmployeeUserKey privateEmployeeUserKey) {
    return new PrivateEmployeeUserKeyDto(
        privateEmployeeUserKey.encryptedPrivateKey(),
        privateEmployeeUserKey.cryptoVersion(),
        privateEmployeeUserKey.keyIdentifier());
  }

  public static UserEventDto mapEventToApi(EventRepresentation eventRepresentation) {
    return new UserEventDto(
        mapToApi(eventRepresentation.getType()),
        eventRepresentation.getIpAddress(),
        Instant.ofEpochMilli(eventRepresentation.getTime()));
  }

  public static UserEventTypeDto mapToApi(String type) {
    return switch (type) {
      case "LOGIN" -> UserEventTypeDto.LOGIN;
      case "LOGIN_ERROR" -> UserEventTypeDto.LOGIN_ERROR;
      default -> throw new IllegalArgumentException("Cannot map event type %s".formatted(type));
    };
  }

  public static KeycloakEventType mapToDm(UserEventTypeDto type) {
    return switch (type) {
      case UserEventTypeDto.LOGIN -> KeycloakEventType.LOGIN;
      case UserEventTypeDto.LOGIN_ERROR -> KeycloakEventType.LOGIN_ERROR;
    };
  }
}

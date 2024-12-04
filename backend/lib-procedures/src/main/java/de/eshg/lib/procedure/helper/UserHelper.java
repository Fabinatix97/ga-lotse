/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.GetUsersResponse;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.user.api.UserFilterParameters;
import de.eshg.base.user.api.UserRoleDto;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.procedure.model.ProgressEntryDto;
import de.eshg.model.HasResolvableUserIds;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.SequencedMap;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class UserHelper {

  private final UserApi userApi;
  private final ModuleLeaderRole moduleLeaderRole;

  public record UserFirstAndLastName(String firstName, String lastName) {

    public String asFullName() {
      return firstName + " " + lastName;
    }
  }

  public UserHelper(UserApi userApi, ModuleLeaderRole moduleLeaderRole) {
    this.userApi = userApi;
    this.moduleLeaderRole = moduleLeaderRole;
  }

  public Map<UUID, UserFirstAndLastName> resolveUsersFirstNamesAndLastNamesByUserUuids(
      Collection<UUID> uuids) {

    if (uuids == null || uuids.isEmpty()) {
      return Map.of();
    }

    List<UUID> nonNullUserIds = uuids.stream().filter(Objects::nonNull).toList();
    GetUsersResponse getUsersResponse =
        userApi.getUsersBulk(new GetUsersRequest(nonNullUserIds, true));
    return getUsersResponse.users().stream()
        .collect(
            Collectors.toMap(
                UserDto::userId,
                user -> new UserFirstAndLastName(user.firstName(), user.lastName())));
  }

  public <T extends ProgressEntryDto> void enrichUsersFirstNamesAndLastNames(T progressEntry) {
    enrichUsersFirstNamesAndLastNames(List.of(progressEntry));
  }

  public void enrichUsersFirstNamesAndLastNames(List<? extends ProgressEntryDto> progressEntries) {
    Set<UUID> userUuids = collectUsersUuids(progressEntries);

    Map<UUID, UserFirstAndLastName> userFirstNameAndLastNameByUuid =
        resolveUsersFirstNamesAndLastNamesByUserUuids(userUuids);

    for (ProgressEntryDto progressEntry : progressEntries) {
      UUID uuid = progressEntry.getRelatedUserId();
      if (uuid != null && userFirstNameAndLastNameByUuid.containsKey(uuid)) {
        UserFirstAndLastName userFirstAndLastName = userFirstNameAndLastNameByUuid.get(uuid);
        progressEntry.setRelatedUserFirstName(userFirstAndLastName.firstName());
        progressEntry.setRelatedUserLastName(userFirstAndLastName.lastName());
      }
    }
  }

  private Set<UUID> collectUsersUuids(List<? extends ProgressEntryDto> progressEntries) {
    return progressEntries.stream()
        .map(ProgressEntryDto::getRelatedUserId)
        .filter(Objects::nonNull)
        .collect(Collectors.toSet());
  }

  public Set<UUID> getUuidsOfModuleLeaders() {
    UserRoleDto userRoleDto = mapModuleLeaderRoleToApi(moduleLeaderRole);
    UserFilterParameters userFilterParameters = new UserFilterParameters(userRoleDto, null);
    return userApi.getUsers(userFilterParameters).users().stream()
        .map(UserDto::userId)
        .collect(StreamUtil.toLinkedHashSet());
  }

  public <T extends HasResolvableUserIds> Map<UUID, UserDto> resolveUsers(
      SequencedMap<UUID, List<T>> map) {
    return resolveUsers(map, false);
  }

  public <T extends HasResolvableUserIds> Map<UUID, UserDto> resolveUsers(
      SequencedMap<UUID, List<T>> map, boolean ignoreUnknownId) {
    Set<UUID> userIds = collectUserIds(map);
    return resolveUsers(userIds, ignoreUnknownId);
  }

  public <T extends HasResolvableUserIds> Map<UUID, UserDto> resolveUsers(List<T> list) {
    return resolveUsers(list, false);
  }

  public <T extends HasResolvableUserIds> Map<UUID, UserDto> resolveUsers(
      List<T> list, boolean ignoreUnknownId) {
    Set<UUID> userIds = collectUserIds(list);
    return resolveUsers(userIds, ignoreUnknownId);
  }

  public Map<UUID, UserDto> resolveUsers(Set<UUID> userIds) {
    return resolveUsers(userIds, false);
  }

  public Map<UUID, UserDto> resolveUsers(Set<UUID> userIds, boolean ignoreUnknownId) {
    return userApi.getUsersBulk(new GetUsersRequest(userIds, ignoreUnknownId)).users().stream()
        .collect(StreamUtil.toLinkedHashMap(UserDto::userId));
  }

  private <T extends HasResolvableUserIds> Set<UUID> collectUserIds(
      SequencedMap<UUID, List<T>> map) {
    Set<UUID> userIds = new LinkedHashSet<>(map.keySet());
    map.values().stream()
        .map(this::collectUserIds)
        .filter(Objects::nonNull)
        .forEach(userIds::addAll);
    return userIds;
  }

  private <T extends HasResolvableUserIds> Set<UUID> collectUserIds(List<T> list) {
    return list.stream()
        .map(HasResolvableUserIds::getResolvableUserIds)
        .flatMap(Collection::stream)
        .filter(Objects::nonNull)
        .collect(StreamUtil.toLinkedHashSet());
  }

  private static UserRoleDto mapModuleLeaderRoleToApi(ModuleLeaderRole moduleLeaderRole) {
    return switch (moduleLeaderRole) {
      case INSPECTION_LEADER -> UserRoleDto.INSPECTION_LEADER;
      case SCHOOL_ENTRY_LEADER -> UserRoleDto.SCHOOL_ENTRY_LEADER;
      case TRAVEL_MEDICINE_LEADER -> UserRoleDto.TRAVEL_MEDICINE_LEADER;
      case MEASLES_PROTECTION_LEADER -> UserRoleDto.MEASLES_PROTECTION_LEADER;
      case STI_PROTECTION_LEADER -> UserRoleDto.STI_PROTECTION_LEADER;
      case MEDICAL_REGISTRY_LEADER -> UserRoleDto.MEDICAL_REGISTRY_LEADER;
      case DENTAL_LEADER -> UserRoleDto.DENTAL_LEADER;
      case OFFICIAL_MEDICAL_SERVICE_LEADER -> UserRoleDto.OFFICIAL_MEDICAL_SERVICE_LEADER;
    };
  }
}

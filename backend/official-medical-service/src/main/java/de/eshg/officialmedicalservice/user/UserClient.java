/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.user;

import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.appointmentblock.AppointmentBlockValidator;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.rest.service.error.BadRequestException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class UserClient {
  private final UserApi userApi;
  private final TechnicalGroup technicalGroupPhysicians;

  public UserClient(
      UserApi userApi,
      @Qualifier(AppointmentBlockValidator.TECHNICAL_GROUP_PHYSICIANS)
          TechnicalGroup technicalGroupPhysicians) {
    this.userApi = userApi;
    this.technicalGroupPhysicians = technicalGroupPhysicians;
  }

  public List<UserDto> retrieveUsers(TechnicalGroup group) {
    return userApi.getUsersByGroup(group.getKeycloakName()).users();
  }

  public Optional<UserDto> retrieveUser(UUID userId, TechnicalGroup group) {
    return retrieveUsers(group).stream()
        .filter(userDto -> userDto.userId().equals(userId))
        .findFirst();
  }

  public UserDto validateUser(UUID userId, TechnicalGroup group) {
    return retrieveUser(userId, group)
        .orElseThrow(
            () -> new BadRequestException("User ID not found in technical group " + group.name()));
  }

  public TechnicalGroup getTechnicalGroupPhysicians() {
    return technicalGroupPhysicians;
  }

  public List<UserDto> retrievePhysicians() {
    return retrieveUsers(technicalGroupPhysicians);
  }

  public Optional<UserDto> retrievePhysician(UUID userId) {
    return retrieveUser(userId, technicalGroupPhysicians);
  }

  public List<UserDto> getPhysicians() {
    return userApi.getUsersByGroup(technicalGroupPhysicians.getKeycloakName()).users();
  }

  public Map<UUID, UserDto> getPhysiciansMap() {
    return createPhysiciansMap(userDto -> userDto);
  }

  public Map<UUID, String> getPhysicianNamesMap() {
    return createPhysiciansMap(userDto -> userDto.firstName() + " " + userDto.lastName());
  }

  public <T> Map<UUID, T> createPhysiciansMap(Function<UserDto, T> valueMapper) {
    return getPhysicians().stream()
        .collect(
            Collectors.toMap(
                UserDto::userId, valueMapper, (key, conflictingKey) -> key, LinkedHashMap::new));
  }

  public UserDto getSelfUser() {
    return userApi.getSelfUser();
  }
}

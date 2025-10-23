/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.client;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.UserDto;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class UserClient {
  private final UserApi userApi;

  public static final String UNKNOWN_USER = "<unbekannter Benutzer>";

  public UserClient(UserApi userApi) {
    this.userApi = userApi;
  }

  @NotNull
  public UserDto getUserById(UUID userId) {
    try {
      return userApi.getUser(userId);
    } catch (HttpClientErrorException.NotFound ex) {
      return createUnknownUser(userId);
    }
  }

  @NotNull
  public Map<UUID, UserDto> getUsersAsMap(Set<UUID> userIds) {
    GetUsersRequest getUsersRequest = new GetUsersRequest(new ArrayList<>(userIds), true);
    List<UserDto> users = userApi.getUsersBulk(getUsersRequest).users();

    Map<UUID, UserDto> userMap =
        users.stream().collect(StreamUtil.toLinkedHashMap(UserDto::userId));

    for (UUID userId : userIds) {
      userMap.putIfAbsent(userId, createUnknownUser(userId));
    }

    return userMap;
  }

  private UserDto createUnknownUser(UUID userId) {
    return new UserDto(userId, UNKNOWN_USER, "unknown@example.com", null, null, "", "", false);
  }
}

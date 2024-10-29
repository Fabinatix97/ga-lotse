/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.GetUsersResponse;
import de.eshg.base.user.api.UserDto;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class StatisticUserService {
  private final UserApi userApiClient;

  public StatisticUserService(UserApi userApiClient) {
    this.userApiClient = userApiClient;
  }

  public Map<UUID, UserDto> getResolvedUsers(Set<UUID> userIds) {
    if (userIds.isEmpty()) {
      return Collections.emptyMap();
    } else {
      GetUsersResponse getUsersResponse =
          userApiClient.getUsersBulk(new GetUsersRequest(userIds, true));
      return getUsersResponse.users().stream()
          .collect(Collectors.toMap(UserDto::userId, userDto -> userDto));
    }
  }
}

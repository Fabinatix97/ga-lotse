/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.GetUsersResponse;
import de.eshg.base.user.api.UserDto;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class StatisticsUserService {
  private final UserApi userApiClient;

  public StatisticsUserService(UserApi userApiClient) {
    this.userApiClient = userApiClient;
  }

  public Map<UUID, UserDto> getResolvedUsers(Set<UUID> userIds) {
    if (userIds.isEmpty()) {
      return Collections.emptyMap();
    } else {
      GetUsersResponse getUsersResponse =
          userApiClient.getUsersBulk(new GetUsersRequest(userIds, true));
      return getUsersResponse.users().stream().collect(StreamUtil.toLinkedHashMap(UserDto::userId));
    }
  }

  public UserDto findUser(UUID userId) {
    return getResolvedUsers(Set.of(userId)).get(userId);
  }
}

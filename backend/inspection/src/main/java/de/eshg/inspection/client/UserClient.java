/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.client;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.GetUsersResponse;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.user.api.UserFilterParameters;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.http.HttpStatus;
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
  public GetUsersResponse getUsers(UserFilterParameters parameters) {
    return userApi.getUsers(parameters);
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
  public Map<UUID, UserDto> getUsersAsMap(Set<UUID> userIds, boolean throwIfUserNotFound) {
    return doAndForwardErrorCodes(
        () -> {
          if (userIds.isEmpty()) {
            return Collections.emptyMap();
          }

          GetUsersRequest getUsersRequest =
              new GetUsersRequest(new ArrayList<>(userIds), !throwIfUserNotFound);
          List<UserDto> users = userApi.getUsersBulk(getUsersRequest).users();

          Map<UUID, UserDto> userMap =
              users.stream().collect(StreamUtil.toLinkedHashMap(UserDto::userId));

          for (UUID userId : userIds) {
            userMap.putIfAbsent(userId, createUnknownUser(userId));
          }

          return userMap;
        });
  }

  @NotNull
  public Map<UUID, UserDto> getUsersAsMap(Set<UUID> userIds) {
    return getUsersAsMap(userIds, false);
  }

  private UserDto createUnknownUser(UUID userId) {
    return new UserDto(userId, UNKNOWN_USER, "unknown@example.com", null, null, "", "", false);
  }

  private <T> T doAndForwardErrorCodes(Supplier<T> action) {
    try {
      return action.get();
    } catch (HttpClientErrorException e) {
      if (e.getStatusCode().isSameCodeAs(HttpStatus.UNAUTHORIZED)) {
        throw new BadRequestException(ErrorCode.UNAUTHORIZED, "Unauthorized base module call");
      }
      ErrorResponse errorResponse = e.getResponseBodyAs(ErrorResponse.class);
      if (errorResponse != null) {
        throw new BadRequestException(errorResponse.errorCode(), errorResponse.message());
      } else {
        throw new BadRequestException(
            ErrorCode.UNEXPECTED_ERROR, "Could not read error from base module");
      }
    }
  }
}

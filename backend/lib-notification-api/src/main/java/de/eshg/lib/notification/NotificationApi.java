/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification;

import de.eshg.lib.notification.api.GetNotificationsResponse;
import de.eshg.lib.notification.api.MarkNotificationsAsReadRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;

@HttpExchange
public interface NotificationApi {

  String BASE_URL = "/notifications";
  String UNREAD_NOTIFICATIONS_URL = BASE_URL + "/unread";

  @GetExchange(BASE_URL)
  @ApiResponse(responseCode = "200", description = "The current users notifications")
  @Operation(summary = "Get notifications for current user")
  GetNotificationsResponse getNotifications();

  @GetExchange(UNREAD_NOTIFICATIONS_URL)
  @ApiResponse(responseCode = "200", description = "The current users unread notifications")
  @Operation(summary = "Get unread notifications for current user")
  GetNotificationsResponse getUnreadNotifications();

  @PatchExchange(BASE_URL)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Mark notifications for the current user as read")
  void markNotificationsAsRead(
      @RequestBody @Valid MarkNotificationsAsReadRequest markNotificationsAsReadRequest);
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.notification;

import de.eshg.lib.notification.api.MarkNotificationsAsReadRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;

@RestController
@HttpExchange(BaseUrls.Base.NOTIFICATION_API_BASE_URL)
@Tag(name = "NotificationAggregation")
public class NotificationAggregationController {
  static final String UNREAD_NOTIFICATIONS_URL = "/unread";

  private final NotificationAggregationService notificationAggregationService;

  public NotificationAggregationController(
      NotificationAggregationService notificationAggregationService) {
    this.notificationAggregationService = notificationAggregationService;
  }

  @GetExchange
  @ApiResponse(responseCode = "200", description = "The current users notifications")
  @Operation(summary = "Get notifications for current user")
  GetAggregatedNotificationsResponse getNotifications() {
    return notificationAggregationService.aggregateNotifications();
  }

  @GetExchange(UNREAD_NOTIFICATIONS_URL)
  @ApiResponse(responseCode = "200", description = "The current users unread notifications")
  @Operation(summary = "Get unread notifications for current user")
  GetAggregatedNotificationsResponse getUnreadNotifications() {
    return notificationAggregationService.aggregateUnreadNotifications();
  }

  @PatchExchange
  @ApiResponse(responseCode = "200", description = "The error responses if business modules fail")
  @Operation(summary = "Mark notifications for the current user as read")
  MarkNotificationsAsReadResponse markNotificationsAsRead(
      @RequestBody @Valid MarkNotificationsAsReadRequest markNotificationsAsReadRequest) {
    return notificationAggregationService.markNotificationsAsRead(markNotificationsAsReadRequest);
  }
}

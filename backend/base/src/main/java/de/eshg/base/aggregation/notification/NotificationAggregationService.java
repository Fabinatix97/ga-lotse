/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.aggregation.notification;

import static de.eshg.lib.aggregation.BusinessModuleAggregationHelper.aggregateErrorResponses;

import de.eshg.base.user.UserService;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.BusinessModuleClient;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.common.BusinessModuleCapability;
import de.eshg.lib.notification.NotificationService;
import de.eshg.lib.notification.api.AbstractNotificationDto;
import de.eshg.lib.notification.api.GetNotificationsResponse;
import de.eshg.lib.notification.api.MarkNotificationsAsReadRequest;
import java.time.Clock;
import java.time.Instant;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationAggregationService {

  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;
  private final List<NotificationService> notificationServices;
  private final UserService userService;
  private final Clock clock;

  public NotificationAggregationService(
      BusinessModuleAggregationHelper businessModuleAggregationHelper,
      List<NotificationService> notificationServices,
      UserService userService,
      Clock clock) {
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.notificationServices = notificationServices;
    this.clock = clock;
    this.userService = userService;
  }

  @Transactional(readOnly = true)
  public GetAggregatedNotificationsResponse aggregateNotifications() {
    List<AbstractNotificationDto> baseModuleNotifications =
        notificationServices.stream()
            .map(NotificationService::getNotificationsForCurrentUser)
            .flatMap(Collection::stream)
            .toList();
    return aggregateNotifications(
        businessModuleAggregationHelper.requestFromBusinessModules(
            userService.getSelfBusinessModules(),
            BusinessModuleCapability.NOTIFICATIONS,
            BusinessModuleClient::getNotifications),
        baseModuleNotifications);
  }

  @Transactional(readOnly = true)
  public GetAggregatedNotificationsResponse aggregateUnreadNotifications() {
    List<AbstractNotificationDto> unreadBaseModuleNotifications =
        notificationServices.stream()
            .map(NotificationService::getUnreadNotificationsForCurrentUser)
            .flatMap(Collection::stream)
            .toList();
    return aggregateNotifications(
        businessModuleAggregationHelper.requestFromBusinessModules(
            userService.getSelfBusinessModules(),
            BusinessModuleCapability.NOTIFICATIONS,
            BusinessModuleClient::getUnreadNotifications),
        unreadBaseModuleNotifications);
  }

  private GetAggregatedNotificationsResponse aggregateNotifications(
      List<ClientResponse<GetNotificationsResponse>> extractedResponses,
      List<AbstractNotificationDto> baseNotifications) {
    Comparator<AbstractNotificationDto> createdAtComparator =
        Comparator.comparing(AbstractNotificationDto::createdAt).reversed();

    Stream<AbstractNotificationDto> businessModuleNotificationsStream =
        extractedResponses.stream()
            .map(ClientResponse::response)
            .filter(Objects::nonNull)
            .map(GetNotificationsResponse::notifications)
            .flatMap(Collection::stream);

    List<AbstractNotificationDto> notifications =
        Stream.concat(businessModuleNotificationsStream, baseNotifications.stream())
            .sorted(createdAtComparator)
            .toList();

    return new GetAggregatedNotificationsResponse(
        notifications, resolveUserIds(notifications), aggregateErrorResponses(extractedResponses));
  }

  private Map<UUID, UserDto> resolveUserIds(List<AbstractNotificationDto> notifications) {
    Set<UUID> collectedUserIds =
        notifications.stream()
            .map(AbstractNotificationDto::getResolvableUserIds)
            .flatMap(Collection::stream)
            .collect(Collectors.toSet());

    Map<UUID, UserDto> sortedMap = new LinkedHashMap<>();
    userService.getUsers(collectedUserIds).stream()
        .sorted(Comparator.comparing(UserDto::username))
        .forEach(userDto -> sortedMap.put(userDto.userId(), userDto));
    return sortedMap;
  }

  @Transactional
  public MarkNotificationsAsReadResponse markNotificationsAsRead(
      MarkNotificationsAsReadRequest markNotificationsAsReadRequest) {
    List<UUID> notificationIds = markNotificationsAsReadRequest.notificationIds();
    Instant now = Instant.now(clock);
    notificationServices.forEach(service -> service.markNotificationsAsRead(notificationIds, now));

    return new MarkNotificationsAsReadResponse(
        aggregateErrorResponses(
            businessModuleAggregationHelper.requestFromBusinessModules(
                userService.getSelfBusinessModules(),
                BusinessModuleCapability.NOTIFICATIONS,
                client -> {
                  client.markNotificationsAsRead(markNotificationsAsReadRequest);
                  return null;
                })));
  }
}

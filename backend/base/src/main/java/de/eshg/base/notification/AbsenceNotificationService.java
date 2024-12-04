/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.notification;

import de.eshg.base.calendar.persistence.entity.Calendar;
import de.eshg.base.calendar.persistence.entity.CalendarEvent;
import de.eshg.base.calendar.persistence.entity.CalendarType;
import de.eshg.base.calendar.persistence.entity.EventType;
import de.eshg.base.notification.persistence.entity.AbsenceNotification;
import de.eshg.base.notification.persistence.repository.AbsenceNotificationRepository;
import de.eshg.base.user.UserService;
import de.eshg.lib.notification.AbstractNotificationService;
import de.eshg.lib.notification.api.AbsenceNotificationDto;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AbsenceNotificationService extends AbstractNotificationService<AbsenceNotification> {
  private final UserService userService;
  private final AbsenceNotificationRepository absenceNotificationRepository;

  public AbsenceNotificationService(
      AbsenceNotificationRepository notificationRepository,
      UserService userService,
      AbsenceNotificationRepository absenceNotificationRepository) {
    super(notificationRepository, null);
    this.userService = userService;
    this.absenceNotificationRepository = absenceNotificationRepository;
  }

  @Override
  protected AbsenceNotificationDto toInterface(AbsenceNotification notification) {
    return new AbsenceNotificationDto(
        notification.getExternalId(),
        notification.getCreatedAt(),
        notification.getReadAt(),
        notification.getAbsentUser(),
        notification.getEventStart(),
        notification.getEventEnd());
  }

  public void createAbsenceNotificationIfNeeded(CalendarEvent calendarEvent) {
    Calendar calendar = calendarEvent.getCalendars().iterator().next();
    if (calendar.getType().equals(CalendarType.USER)
        && calendarEvent.getEventType().equals(EventType.VACATION)) {
      Set<UUID> recipientUserIds = getOtherUsersInGroups(calendar.getUserId());

      recipientUserIds.forEach(
          userId ->
              saveNotification(
                  calendarEvent.getEventStart(),
                  calendarEvent.getEventEnd(),
                  userId,
                  calendar.getUserId()));
    }
  }

  private Set<UUID> getOtherUsersInGroups(UUID absentUserId) {
    Set<UUID> recipientUserIds = new HashSet<>();
    List<String> groupNames = userService.getUserKeycloakGroups();
    groupNames.forEach(
        groupName -> recipientUserIds.addAll(getRelevantUsers(groupName, absentUserId)));
    return recipientUserIds;
  }

  private List<UUID> getRelevantUsers(String groupName, UUID absentUserId) {
    return userService.getUsersByGroup(groupName).stream()
        .map(userRepresentation -> UUID.fromString(userRepresentation.getId()))
        .filter(uuid -> !uuid.equals(absentUserId))
        .toList();
  }

  private void saveNotification(Instant start, Instant end, UUID recipientUserId, UUID absentUser) {
    AbsenceNotification absenceNotification = new AbsenceNotification();
    absenceNotification.setEventStart(start);
    absenceNotification.setEventEnd(end);
    absenceNotification.setAbsentUser(absentUser);
    absenceNotification.setRecipientUserId(recipientUserId);
    absenceNotificationRepository.save(absenceNotification);
  }
}

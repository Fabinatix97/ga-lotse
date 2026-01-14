/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.mail.MailApi;
import de.eshg.base.mail.SendEmailNotificationRequest;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.notification.domain.model.Notification;
import de.eshg.lib.notification.domain.model.SimpleNotification;
import de.eshg.lib.notification.domain.repository.SimpleNotificationRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.SequencedSet;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApprovalRequestMailService {

  private static final Logger log = LoggerFactory.getLogger(ApprovalRequestMailService.class);

  private static final Duration REMINDER_DELAY = Duration.ofMinutes(15);
  private static final String MAIL_TEXT_TEMPLATE =
      "Bitte in Keycloak freigeben: Ein neuer Benutzer soll hinzugefügt werden.";

  private final SimpleNotificationRepository simpleNotificationRepository;
  private final MailApi mailApi;
  private final Clock clock;
  private final UserService userController;

  public ApprovalRequestMailService(
      SimpleNotificationRepository simpleNotificationRepository,
      MailApi mailApi,
      Clock clock,
      UserService userHelper) {
    this.simpleNotificationRepository = simpleNotificationRepository;
    this.mailApi = mailApi;
    this.clock = clock;
    this.userController = userHelper;
  }

  @Transactional
  public void sendApprovalRequestMailRemindersIfNecessary() {
    Instant maxCreatedAt = Instant.now(clock).minus(REMINDER_DELAY);

    List<SimpleNotification> notifications = getAllNotifications(maxCreatedAt);
    Map<UUID, UserDto> resolvedUsers = resolveUsers(notifications);
    removeInvalidNotifications(notifications, resolvedUsers);

    getAllNotifications(maxCreatedAt).forEach(this::sendApprovalRequestMailReminder);
  }

  private List<SimpleNotification> getAllNotifications(Instant maxCreatedAt) {
    return Stream.of(simpleNotificationRepository)
        .map(repo -> repo.findAllRelevantForMailSendingThatWereCreatedBefore(maxCreatedAt))
        .flatMap(Collection::stream)
        .toList();
  }

  private void removeInvalidNotifications(
      List<SimpleNotification> notifications, Map<UUID, UserDto> resolvedUsers) {
    notifications.stream()
        .filter(notification -> !resolvedUsers.containsKey(notification.getRecipientUserId()))
        .forEach(
            invalidNotification -> {
              log.debug(
                  "User with id {} does not exist anymore, therefore removing notification {}",
                  invalidNotification.getRecipientUserId(),
                  invalidNotification.getId());
              simpleNotificationRepository.delete(invalidNotification);
            });
  }

  private Map<UUID, UserDto> resolveUsers(List<SimpleNotification> notifications) {
    SequencedSet<UUID> collectedUserIds =
        notifications.stream()
            .map(Notification::getRecipientUserId)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    return userController.getUsers(collectedUserIds, true).stream()
        .collect(StreamUtil.toLinkedHashMap(UserDto::userId));
  }

  private void sendApprovalRequestMailReminder(SimpleNotification notification) {
    try {
      mailApi.sendEmailNotification(toMail(notification));
      notification.setMailToSentFlag(false);
      notification.setMailSentAt(Instant.now(clock));
    } catch (RuntimeException e) {
      log.error(
          "Sending mail for notification {} to user {} failed",
          notification.getExternalId(),
          notification.getRecipientUserId(),
          e);
    }
  }

  private SendEmailNotificationRequest toMail(SimpleNotification notification) {
    return new SendEmailNotificationRequest(notification.getRecipientUserId(), MAIL_TEXT_TEMPLATE);
  }
}

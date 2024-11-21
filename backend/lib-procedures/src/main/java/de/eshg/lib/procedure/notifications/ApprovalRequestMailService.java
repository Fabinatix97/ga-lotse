/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.notifications;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.mail.MailApi;
import de.eshg.base.mail.SendEmailNotificationRequest;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.notification.domain.model.Notification;
import de.eshg.lib.procedure.domain.model.NotificationWithEmailReminder;
import de.eshg.lib.procedure.domain.repository.FileDeletionApprovalRequestNotificationRepository;
import de.eshg.lib.procedure.domain.repository.ManualProgressEntryDeletionApprovalRequestNotificationRepository;
import de.eshg.lib.procedure.helper.UserHelper;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApprovalRequestMailService {

  private static final Logger log = LoggerFactory.getLogger(ApprovalRequestMailService.class);

  private static final Duration REMINDER_DELAY = Duration.ofMinutes(15);
  public static final DateTimeFormatter DATE_FORMATTER =
      DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT).localizedBy(Locale.GERMAN);
  private static final String MAIL_TEXT_TEMPLATE =
      """
    Sie haben am %s eine Löschanfrage erhalten.
    Bitte prüfen Sie Ihre Benachrichtigungen in GA-Lotse.
    """;

  private final FileDeletionApprovalRequestNotificationRepository
      fileDeletionApprovalRequestNotificationRepository;
  private final ManualProgressEntryDeletionApprovalRequestNotificationRepository
      manualProgressEntryDeletionApprovalRequestNotificationRepository;
  private final MailApi mailApi;
  private final Clock clock;
  private final UserHelper userHelper;

  @Autowired
  public ApprovalRequestMailService(
      FileDeletionApprovalRequestNotificationRepository
          fileDeletionApprovalRequestNotificationRepository,
      ManualProgressEntryDeletionApprovalRequestNotificationRepository
          manualProgressEntryDeletionApprovalRequestNotificationRepository,
      MailApi mailApi,
      Clock clock,
      UserHelper userHelper) {
    this.fileDeletionApprovalRequestNotificationRepository =
        fileDeletionApprovalRequestNotificationRepository;
    this.manualProgressEntryDeletionApprovalRequestNotificationRepository =
        manualProgressEntryDeletionApprovalRequestNotificationRepository;
    this.mailApi = mailApi;
    this.clock = clock;
    this.userHelper = userHelper;
  }

  @Transactional
  public void sendApprovalRequestMailRemindersIfNecessary() {
    Instant maxCreatedAt = Instant.now(clock).minus(REMINDER_DELAY);

    List<NotificationWithEmailReminder> notifications =
        Stream.of(
                fileDeletionApprovalRequestNotificationRepository,
                manualProgressEntryDeletionApprovalRequestNotificationRepository)
            .map(repo -> repo.findAllRelevantForMailSendingThatWereCreatedBefore(maxCreatedAt))
            .flatMap(Collection::stream)
            .collect(Collectors.toUnmodifiableList());

    Map<UUID, UserDto> resolvedUsers = resolveUsers(notifications);
    notifications.stream()
        .filter(hasRecipientThatIsKnownUser(resolvedUsers))
        .forEach(this::sendApprovalRequestMailReminder);
  }

  private Predicate<NotificationWithEmailReminder> hasRecipientThatIsKnownUser(
      Map<UUID, UserDto> resolvedUsers) {
    return notification -> {
      boolean isKnownUser = resolvedUsers.containsKey(notification.getRecipientUserId());
      if (!isKnownUser) {
        log.debug(
            "User with id {} does not exist anymore, skipping reminder mail",
            notification.getRecipientUserId());
      }
      return isKnownUser;
    };
  }

  private Map<UUID, UserDto> resolveUsers(List<NotificationWithEmailReminder> notifications) {
    Set<UUID> collectedUserIds =
        notifications.stream()
            .map(Notification::getRecipientUserId)
            .collect(StreamUtil.toLinkedHashSet());
    return userHelper.resolveUsers(collectedUserIds);
  }

  private void sendApprovalRequestMailReminder(NotificationWithEmailReminder notification) {
    try {
      mailApi.sendEmailNotification(toMail(notification));
      notification.setMailSent(Instant.now(clock));
    } catch (RuntimeException e) {
      log.error(
          "Sending mail for notification {} to user {} failed",
          notification.getExternalId(),
          notification.getRecipientUserId(),
          e);
    }
  }

  private SendEmailNotificationRequest toMail(NotificationWithEmailReminder notification) {
    String notificationDate =
        LocalDateTime.ofInstant(notification.getCreatedAt(), clock.getZone())
            .format(DATE_FORMATTER);
    return new SendEmailNotificationRequest(
        notification.getRecipientUserId(), MAIL_TEXT_TEMPLATE.formatted(notificationDate));
  }
}

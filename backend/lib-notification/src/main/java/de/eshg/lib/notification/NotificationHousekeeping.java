/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification;

import de.eshg.lib.notification.config.NotificationHousekeepingProperties;
import de.eshg.lib.notification.domain.repository.NotificationRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class NotificationHousekeeping {

  private static final Logger log = LoggerFactory.getLogger(NotificationHousekeeping.class);
  private final NotificationHousekeepingProperties notificationHousekeepingProperties;
  private final List<NotificationRepository<?>> notificationRepositories;
  private final Clock clock;

  public NotificationHousekeeping(
      NotificationHousekeepingProperties notificationHousekeepingProperties,
      List<NotificationRepository<?>> notificationRepositories,
      Clock clock) {
    this.notificationHousekeepingProperties = notificationHousekeepingProperties;
    this.notificationRepositories = notificationRepositories;
    this.clock = clock;
  }

  @Transactional
  @Scheduled(cron = "${de.eshg.notifications.housekeeping.schedule:@daily}")
  @SchedulerLock(
      name = "LibNotificationNotificationHousekeeping",
      lockAtMostFor = "${de.eshg.notifications.housekeeping.lock-at-most-for:23h}")
  public void cleanupNotifications() {
    LockAssert.assertLocked();
    for (NotificationRepository<?> repository : notificationRepositories) {
      if (log.isInfoEnabled()) {
        log.info("Performing housekeeping for: {}", tryGetRepositoryName(repository));
      }

      cleanupReadNotifications(repository, notificationHousekeepingProperties.getReadMaxAgeDays());
      cleanupUnreadNotifications(
          repository, notificationHousekeepingProperties.getUnreadMaxAgeDays());
    }
  }

  private void cleanupUnreadNotifications(NotificationRepository<?> repository, Period maxAgeDays) {
    Instant createdAtLimit = calculateCreatedAtLimit(maxAgeDays);
    logCleanupStarted(createdAtLimit, "unread");

    long numberOfDeletedNotifications =
        repository.deleteByReadAtNullAndCreatedAtLessThan(createdAtLimit);

    logNumberOfDeletedNotifications(numberOfDeletedNotifications, "unread");
  }

  private void cleanupReadNotifications(NotificationRepository<?> repository, Period maxAgeDays) {
    Instant createdAtLimit = calculateCreatedAtLimit(maxAgeDays);
    logCleanupStarted(createdAtLimit, "read");

    long numberOfDeletedNotifications =
        repository.deleteByReadAtNotNullAndCreatedAtLessThan(createdAtLimit);

    logNumberOfDeletedNotifications(numberOfDeletedNotifications, "read");
  }

  private void logNumberOfDeletedNotifications(long umberOfDeletedNotifications, String type) {
    log.info("Deleted {} {} notifications", umberOfDeletedNotifications, type);
  }

  private void logCleanupStarted(Instant createdAtLimit, String type) {
    log.info("Cleaning up {} notifications created before {}", type, createdAtLimit);
  }

  private Instant calculateCreatedAtLimit(Period maxAgeDays) {
    return LocalDate.now(clock).atStartOfDay().minus(maxAgeDays).atZone(ZoneOffset.UTC).toInstant();
  }

  private String tryGetRepositoryName(NotificationRepository<?> repo) {
    return Arrays.stream(repo.getClass().getInterfaces())
        .map(Class::getName)
        .filter(name -> name.startsWith("de.eshg"))
        .findFirst()
        .orElse("unknown repository");
  }
}

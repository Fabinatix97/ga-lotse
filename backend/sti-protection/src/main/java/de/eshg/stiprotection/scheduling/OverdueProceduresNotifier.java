/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.scheduling;

import de.eshg.lib.notification.domain.model.SimpleNotification;
import de.eshg.lib.notification.domain.repository.SimpleNotificationRepository;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class OverdueProceduresNotifier {

  private final StiProtectionProcedureRepository procedures;
  private final SimpleNotificationRepository notificationRepository;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final Duration overdueDuration;
  private final Clock clock;

  public OverdueProceduresNotifier(
      StiProtectionProcedureRepository procedures,
      SimpleNotificationRepository notificationRepository,
      ModuleClientAuthenticator moduleClientAuthenticator,
      @Value("${eshg.sti-protection.overdue-procedures.overdue-duration:180d}")
          Duration overdueDuration,
      Clock clock) {
    this.procedures = procedures;
    this.notificationRepository = notificationRepository;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.overdueDuration = overdueDuration;
    this.clock = clock;
  }

  @Scheduled(cron = "${eshg.sti-protection.overdue-procedures.cron}")
  @SchedulerLock(name = "OverdueProceduresNotifier", lockAtMostFor = "30m", lockAtLeastFor = "1m")
  @Transactional
  public void scheduleRun() {
    LockAssert.assertLocked();
    runNow();
  }

  @Transactional
  public void runNow() {
    Instant overdueLimit = clock.instant().minus(overdueDuration);
    List<SimpleNotification> notifications = generateNotifications(overdueLimit);
    SecurityContextHolder.clearContext();
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> notificationRepository.saveAll(notifications));
  }

  private List<SimpleNotification> generateNotifications(Instant overdueLimit) {
    return procedures.findByCreatedAtBefore(overdueLimit).stream()
        .map(procedure -> procedure.getTasks().getFirst())
        .map(Task::getAssigneeId)
        .distinct()
        .map(OverdueProceduresNotifier::toNotification)
        .toList();
  }

  private static SimpleNotification toNotification(UUID assigneeId) {
    return new SimpleNotification(
        assigneeId,
        "Vorgang überprüfen",
        "Es existieren veraltete, noch nicht geschlossene Vorgänge. Bitte überprüfen Sie diese.");
  }
}

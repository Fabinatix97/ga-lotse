/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.lib.notification.domain.model.SimpleNotification;
import de.eshg.lib.notification.domain.repository.SimpleNotificationRepository;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.Period;
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
  private final Clock clock;

  @Value("${eshg.sti-protection.overdue-procedures.overdue-days:180}")
  private int overdueDays;

  public OverdueProceduresNotifier(
      StiProtectionProcedureRepository procedures,
      SimpleNotificationRepository notificationRepository,
      ModuleClientAuthenticator moduleClientAuthenticator,
      Clock clock) {
    this.procedures = procedures;
    this.notificationRepository = notificationRepository;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.clock = clock;
  }

  @Scheduled(cron = "${eshg.sti-protection.overdue-procedures.cron}")
  @SchedulerLock(name = "OverdueProceduresNotifier")
  @Transactional
  public void run() {
    LockAssert.assertLocked();
    runNow();
  }

  @Transactional
  public void runNow() {
    Instant overdueLimit = clock.instant().minus(Period.ofDays(overdueDays));
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

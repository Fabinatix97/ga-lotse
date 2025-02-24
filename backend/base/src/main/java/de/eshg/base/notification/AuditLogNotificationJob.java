/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.notification;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AuditLogNotificationJob {

  private final AuditLogNotificationService auditLogNotificationService;
  private final ModuleClientAuthenticator moduleClientAuthenticator;

  public AuditLogNotificationJob(
      AuditLogNotificationService auditLogNotificationService,
      ModuleClientAuthenticator moduleClientAuthenticator) {
    this.auditLogNotificationService = auditLogNotificationService;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
  }

  @Scheduled(cron = "${eshg.base.auditlog.notification.schedule:@daily}")
  @SchedulerLock(
      name = "BaseAuditLogNotificationJob",
      lockAtMostFor = "${eshg.base.auditlog.notification.lock-at-most-for:23h}")
  public void run() {
    LockAssert.assertLocked();
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        auditLogNotificationService::sendNotifications);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.notification;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
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
  public void run() {
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        auditLogNotificationService::sendNotifications);
  }
}

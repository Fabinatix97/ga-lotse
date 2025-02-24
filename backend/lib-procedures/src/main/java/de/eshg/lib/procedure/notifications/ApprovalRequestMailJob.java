/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.notifications;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ApprovalRequestMailJob {
  private final ApprovalRequestMailService approvalRequestMailService;
  private final ModuleClientAuthenticator moduleClientAuthenticator;

  public ApprovalRequestMailJob(
      ApprovalRequestMailService approvalRequestMailService,
      ModuleClientAuthenticator moduleClientAuthenticator) {
    this.approvalRequestMailService = approvalRequestMailService;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
  }

  @Scheduled(cron = "${de.eshg.lib.procedure.mailreminder.schedule:0 * * * * *}")
  @SchedulerLock(
      name = "LibProceduresApprovalRequestMailJob",
      lockAtMostFor = "${de.eshg.lib.procedure.mailreminder.lock-at-most-for:1h}")
  public void sendApprovalRequestMailRemindersIfNecessary() {
    LockAssert.assertLocked();
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        approvalRequestMailService::sendApprovalRequestMailRemindersIfNecessary);
  }
}

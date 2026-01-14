/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user;

import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class AddUserRequestMailJob {
  private final ApprovalRequestMailService approvalRequestMailService;

  public AddUserRequestMailJob(ApprovalRequestMailService approvalRequestMailService) {
    this.approvalRequestMailService = approvalRequestMailService;
  }

  @Scheduled(cron = "${de.eshg.base.user.schedule:0 * * * * *}")
  @SchedulerLock(
      name = "BaseAddUserRequestMailJob",
      lockAtMostFor = "${de.eshg.base.user.lock-at-most-for:15m}")
  public void sendApprovalRequestMailRemindersIfNecessary() {
    LockAssert.assertLocked();
    approvalRequestMailService.sendApprovalRequestMailRemindersIfNecessary();
  }
}

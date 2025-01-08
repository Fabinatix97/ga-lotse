/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class AddUserRequestMailJob {
  private final ApprovalRequestMailService approvalRequestMailService;

  public AddUserRequestMailJob(ApprovalRequestMailService approvalRequestMailService) {
    this.approvalRequestMailService = approvalRequestMailService;
  }

  @Scheduled(cron = "${de.eshg.base.user.schedule:0 * * * * *}")
  public void sendApprovalRequestMailRemindersIfNecessary() {
    approvalRequestMailService.sendApprovalRequestMailRemindersIfNecessary();
  }
}

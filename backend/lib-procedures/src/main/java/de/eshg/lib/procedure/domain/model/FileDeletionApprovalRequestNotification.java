/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(indexes = @Index(columnList = "approval_request_id"))
public class FileDeletionApprovalRequestNotification extends NotificationWithEmailReminder {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "approval_request_id")
  private FileDeletionApprovalRequest approvalRequest;

  public FileDeletionApprovalRequest getApprovalRequest() {
    return approvalRequest;
  }

  public void setApprovalRequest(FileDeletionApprovalRequest approvalRequest) {
    this.approvalRequest = approvalRequest;
  }
}

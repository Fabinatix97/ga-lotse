/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequestNotification_.APPROVAL_REQUEST;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.foureyes.domain.model.DeletionApprovalRequest;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ManualProgressEntryDeletionApprovalRequest
    extends DeletionApprovalRequest<ManualProgressEntry> {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(mappedBy = ManualProgressEntry_.DELETION_APPROVAL_REQUEST)
  private ManualProgressEntry manualProgressEntry;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToMany(mappedBy = APPROVAL_REQUEST, cascade = CascadeType.PERSIST, orphanRemoval = true)
  @OrderBy
  private final List<ManualProgressEntryDeletionApprovalRequestNotification> notifications =
      new ArrayList<>();

  @Override
  public ManualProgressEntry getEntity() {
    return getManualProgressEntry();
  }

  public ManualProgressEntry getManualProgressEntry() {
    return manualProgressEntry;
  }

  public void setManualProgressEntry(ManualProgressEntry manualProgressEntry) {
    this.manualProgressEntry = manualProgressEntry;
  }

  public void addNotification(ManualProgressEntryDeletionApprovalRequestNotification notification) {
    if (notification != null) {
      notification.setApprovalRequest(this);
      this.notifications.add(notification);
    }
  }

  @Override
  public void updateEntity(ManualProgressEntry manualProgressEntry) {
    if (manualProgressEntry == null) {
      if (this.manualProgressEntry != null) {
        this.manualProgressEntry.setDeletionApprovalRequest(null);
      }
    } else {
      manualProgressEntry.setDeletionApprovalRequest(this);
    }
    this.manualProgressEntry = manualProgressEntry;
  }
}

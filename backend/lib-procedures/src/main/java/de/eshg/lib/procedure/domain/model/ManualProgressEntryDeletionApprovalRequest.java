/*
 * Copyright 2024 cronn GmbH
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
    extends DeletionApprovalRequest<ManualProgressEntry>
    implements NotificationsAware<ManualProgressEntryDeletionApprovalRequestNotification> {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne
  private ManualProgressEntry manualProgressEntry;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToMany(mappedBy = APPROVAL_REQUEST, cascade = CascadeType.PERSIST)
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

  @Override
  public void setEntity(ManualProgressEntry entity) {
    setManualProgressEntry(entity);
  }

  public void setManualProgressEntry(ManualProgressEntry manualProgressEntry) {
    this.manualProgressEntry = manualProgressEntry;
  }

  @Override
  public List<ManualProgressEntryDeletionApprovalRequestNotification> getNotifications() {
    return notifications;
  }

  public void addNotification(ManualProgressEntryDeletionApprovalRequestNotification notification) {
    if (notification != null) {
      notification.setApprovalRequest(this);
      this.notifications.add(notification);
    }
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequestNotification_.APPROVAL_REQUEST;

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
public class FileDeletionApprovalRequest extends DeletionApprovalRequest<File> {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(mappedBy = File_.DELETION_APPROVAL_REQUEST)
  private File file;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToMany(mappedBy = APPROVAL_REQUEST, cascade = CascadeType.PERSIST, orphanRemoval = true)
  @OrderBy
  private final List<FileDeletionApprovalRequestNotification> notifications = new ArrayList<>();

  @Override
  public File getEntity() {
    return getFile();
  }

  public File getFile() {
    return file;
  }

  public void setFile(File file) {
    this.file = file;
  }

  public void addNotification(FileDeletionApprovalRequestNotification notification) {
    if (notification != null) {
      notification.setApprovalRequest(this);
      notifications.add(notification);
    }
  }

  @Override
  public void updateEntity(File file) {
    if (file == null) {
      if (this.file != null) {
        this.file.setDeletionApprovalRequest(null);
      }
    } else {
      file.setDeletionApprovalRequest(this);
    }
    this.file = file;
  }
}

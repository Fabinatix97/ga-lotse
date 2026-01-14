/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.util.UUID;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(indexes = @Index(columnList = "task_id"))
public class AssignmentHistoryItem extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = Assignment_.ASSIGNED_BY_ID, column = @Column(nullable = false)),
    @AttributeOverride(name = Assignment_.ASSIGNMENT_DATE, column = @Column(nullable = false)),
  })
  private Assignment assignment;

  protected AssignmentHistoryItem() {}

  AssignmentHistoryItem(Assignment assignment) {
    this.assignment = assignment;
  }

  public UUID getAssignedById() {
    if (assignment == null) {
      return null;
    }

    return assignment.assignedById();
  }

  public UUID getAssigneeId() {
    if (assignment == null) {
      return null;
    }

    return assignment.assigneeId();
  }
}

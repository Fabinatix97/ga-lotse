/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Task<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>>
    extends SequencedBaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ManyToOne(optional = false)
  @JoinColumn(name = "procedure_id")
  private ProcedureT procedure;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private TaskStatus taskStatus;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private TaskType taskType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @LastModifiedDate
  private Instant modifiedAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant dueAt;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Embedded
  private Assignment currentAssignment;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToMany(cascade = CascadeType.PERSIST, orphanRemoval = true)
  @JoinColumn(nullable = false, name = "task_id")
  @OrderBy
  private final List<AssignmentHistoryItem> assignmentHistory = new ArrayList<>();

  @OneToMany(cascade = CascadeType.PERSIST, orphanRemoval = true)
  @JoinColumn(nullable = false, name = "task_id")
  @OrderBy
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private final List<TaskDueAtReminderNotification> notifications = new ArrayList<>();

  public TaskStatus getTaskStatus() {
    return taskStatus;
  }

  public void setTaskStatus(TaskStatus taskStatus) {
    this.taskStatus = taskStatus;
  }

  public TaskType getTaskType() {
    return taskType;
  }

  public void setTaskType(TaskType taskType) {
    this.taskType = taskType;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }

  public Instant getDueAt() {
    return dueAt;
  }

  public void updateDueAt(Instant dueAt) {
    boolean dueAtHasChanged = !Objects.equals(getDueAt(), dueAt);
    this.dueAt = dueAt;

    createNotificationsIfNecessary();
    if (dueAtHasChanged) {
      resetNotifications();
    }
  }

  public UUID getAssigneeId() {
    if (currentAssignment == null) {
      return null;
    }

    return currentAssignment.assigneeId();
  }

  public UUID getAssignedById() {
    if (currentAssignment == null) {
      return null;
    }

    return currentAssignment.assignedById();
  }

  public void assign(UUID assigneeId, UUID assignedById, Instant assignmentDate) {
    boolean assigneeHasChanged = !Objects.equals(getAssigneeId(), assigneeId);

    updateAssignmentHistory();
    currentAssignment = new Assignment(assigneeId, assignedById, assignmentDate);

    createNotificationsIfNecessary();
    if (assigneeHasChanged) {
      resetNotifications();
    }
  }

  private void updateAssignmentHistory() {
    if (currentAssignment != null) {
      assignmentHistory.add(new AssignmentHistoryItem(currentAssignment));
    }
  }

  private void createNotificationsIfNecessary() {
    if (notifications.isEmpty() && shouldHaveNotifications()) {
      TaskDueAtReminderNotification threeDayNotification =
          new TaskDueAtReminderNotification(
              TaskDueAtReminderNotificationType.THREE_DAYS_BEFORE_DUE_AT);
      TaskDueAtReminderNotification oneDayNotification =
          new TaskDueAtReminderNotification(
              TaskDueAtReminderNotificationType.ONE_DAY_BEFORE_DUE_AT);
      notifications.addAll(List.of(threeDayNotification, oneDayNotification));
    }
  }

  private boolean shouldHaveNotifications() {
    return dueAt != null && getAssigneeId() != null;
  }

  private void resetNotifications() {
    if (shouldHaveNotifications()) {
      notifications.forEach(notification -> notification.setReadAt(null));
    } else {
      notifications.clear();
    }
  }

  public ProcedureT getProcedure() {
    return procedure;
  }

  public void setProcedure(ProcedureT procedure) {
    this.procedure = procedure;
  }

  public List<AssignmentHistoryItem> getAssignmentHistory() {
    return assignmentHistory;
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "task_id"))
public class TaskDueAtReminderNotification extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private Instant readAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private TaskDueAtReminderNotificationType reminderType;

  public TaskDueAtReminderNotification() {}

  public TaskDueAtReminderNotification(TaskDueAtReminderNotificationType reminderType) {
    this.reminderType = reminderType;
  }

  public Instant getReadAt() {
    return readAt;
  }

  public void setReadAt(Instant readAt) {
    this.readAt = readAt;
  }

  public TaskDueAtReminderNotificationType getReminderType() {
    return reminderType;
  }
}

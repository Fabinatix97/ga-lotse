/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

public enum TaskDueAtReminderNotificationType {
  ONE_DAY_BEFORE_DUE_AT(1),
  THREE_DAYS_BEFORE_DUE_AT(3);

  private final int businessDays;

  TaskDueAtReminderNotificationType(int businessDays) {
    this.businessDays = businessDays;
  }

  public int getBusinessDays() {
    return businessDays;
  }
}

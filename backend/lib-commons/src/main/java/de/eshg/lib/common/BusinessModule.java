/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.common;

import static de.eshg.lib.common.BusinessModuleCapability.*;

import de.cronn.commons.lang.SetUtils;
import java.util.Set;

public enum BusinessModule {
  INSPECTION(PROCEDURES, TASKS, PROCEDURE_AND_TASK_METRICS, NOTIFICATIONS, CALENDAR),
  SCHOOL_ENTRY(
      PROCEDURES,
      TASKS,
      PROCEDURE_AND_TASK_METRICS,
      NOTIFICATIONS,
      CALENDAR,
      CONTACT_MERGED_EVENT_CALLBACK),
  TRAVEL_MEDICINE(PROCEDURES, TASKS, PROCEDURE_AND_TASK_METRICS, NOTIFICATIONS, CALENDAR),
  MEASLES_PROTECTION(PROCEDURES, TASKS, PROCEDURE_AND_TASK_METRICS, NOTIFICATIONS, CALENDAR),
  STI_PROTECTION(PROCEDURES, TASKS, PROCEDURE_AND_TASK_METRICS, NOTIFICATIONS, CALENDAR),
  MEDICAL_REGISTRY(PROCEDURES, PROCEDURE_AND_TASK_METRICS, NOTIFICATIONS),
  DENTAL(PROCEDURES, NOTIFICATIONS, CONTACT_MERGED_EVENT_CALLBACK),
  OFFICIAL_MEDICAL_SERVICE(PROCEDURES, PROCEDURE_AND_TASK_METRICS, NOTIFICATIONS, CALENDAR),
  MEDS_ABROAD(PROCEDURES, TASKS, PROCEDURE_AND_TASK_METRICS, NOTIFICATIONS, CALENDAR),
  PROSTITUTE_PROTECTION;

  private final Set<BusinessModuleCapability> capabilities;

  BusinessModule(BusinessModuleCapability... capabilities) {
    this.capabilities = SetUtils.orderedSet(capabilities);
  }

  public boolean hasCapability(BusinessModuleCapability capability) {
    return this.capabilities.contains(capability);
  }
}

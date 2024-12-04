/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.common;

import static de.eshg.lib.common.BusinessModuleCapability.*;

import de.cronn.commons.lang.SetUtils;
import java.util.Set;

public enum BusinessModule {
  INSPECTION(PROCEDURES, TASKS, NOTIFICATIONS, CALENDAR),
  SCHOOL_ENTRY(PROCEDURES, TASKS, NOTIFICATIONS, CALENDAR, CONTACT_MERGED_EVENT_CALLBACK),
  TRAVEL_MEDICINE(PROCEDURES, TASKS, NOTIFICATIONS, CALENDAR),
  MEASLES_PROTECTION(PROCEDURES, TASKS, NOTIFICATIONS, CALENDAR),
  STI_PROTECTION(PROCEDURES, TASKS, NOTIFICATIONS, CALENDAR),
  MEDICAL_REGISTRY(PROCEDURES),
  DENTAL(PROCEDURES, CONTACT_MERGED_EVENT_CALLBACK),
  OFFICIAL_MEDICAL_SERVICE(PROCEDURES),
  ;

  private final Set<BusinessModuleCapability> capabilities;

  BusinessModule(BusinessModuleCapability... capabilities) {
    this.capabilities = SetUtils.orderedSet(capabilities);
  }

  public boolean hasCapability(BusinessModuleCapability capability) {
    return this.capabilities.contains(capability);
  }
}

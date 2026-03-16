/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.eshg.lib.procedure.domain.model.TriggerType;

public enum InfectionBriefingTriggerType {
  CITIZEN,
  EMPLOYEE;

  public TriggerType toTriggerType() {
    return switch (this) {
      case CITIZEN -> TriggerType.CITIZEN;
      case EMPLOYEE -> TriggerType.EMPLOYEE;
    };
  }
}

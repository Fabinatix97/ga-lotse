/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.util;

import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;

public class InfectionBriefingSystemProgressEntryFactory {

  private InfectionBriefingSystemProgressEntryFactory() {}

  public static SystemProgressEntry createEmployeeTriggeredSystemProgressEntry(
      InfectionBriefingProgressEntryType progressEntryType) {
    return SystemProgressEntryFactory.createSystemProgressEntry(
        progressEntryType.name(), TriggerType.EMPLOYEE);
  }

  public static SystemProgressEntry createEmployeeTriggeredSystemProgressEntry(
      InfectionBriefingProgressEntryType progressEntryType,
      InfectionBriefingKeyDocumentType keyDocumentType) {
    return SystemProgressEntryFactory.createSystemProgressEntry(
        progressEntryType.name(), null, TriggerType.EMPLOYEE, keyDocumentType.name());
  }
}

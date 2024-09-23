/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.factory;

import de.eshg.lib.procedure.domain.model.BasicSystemProgressEntryType;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;

public class SystemProgressEntryFactory {

  private SystemProgressEntryFactory() {}

  public static ProgressEntry createSystemProgressEntry(
      BasicSystemProgressEntryType systemProgressEntryChangeDescription, TriggerType triggerType) {
    String systemProgressEntryChangeDescriptionString = systemProgressEntryChangeDescription.name();
    return createSystemProgressEntry(systemProgressEntryChangeDescriptionString, triggerType);
  }

  public static SystemProgressEntry createSystemProgressEntry(
      String systemProgressEntryType, TriggerType triggerType) {
    return createSystemProgressEntry(systemProgressEntryType, null, triggerType);
  }

  public static SystemProgressEntry createSystemProgressEntry(
      String systemProgressEntryType, String changeDescription, TriggerType triggerType) {
    SystemProgressEntry systemProgressEntry = new SystemProgressEntry();
    systemProgressEntry.setTriggerType(triggerType);
    systemProgressEntry.setSystemProgressEntryType(systemProgressEntryType);
    systemProgressEntry.setChangeDescription(changeDescription);
    return systemProgressEntry;
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.util;

import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import de.eshg.medsabroad.persistence.database.MedsAbroadSystemProgressEntryType;
import org.springframework.stereotype.Component;

@Component
public class ProgressEntryUtil {

  public void addProgressEntry(
      MedsAbroadProcedure procedure,
      MedsAbroadSystemProgressEntryType progressEntryType,
      TriggerType triggerType,
      Object... changeDescriptionArgs) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(),
            progressEntryType.getChangeDescription().formatted(changeDescriptionArgs),
            triggerType);
    procedure.addProgressEntry(progressEntry);
  }
}

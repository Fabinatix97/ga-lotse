/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.util;

import de.eshg.dental.domain.model.Child;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.progressentry.ProgressEntryService;
import org.springframework.stereotype.Component;

@Component
public class ProgressEntryUtil {
  private final ProgressEntryService<Child> progressEntryService;

  public ProgressEntryUtil(ProgressEntryService<Child> progressEntryService) {
    this.progressEntryService = progressEntryService;
  }

  public void addSystemProgressEntry(Child child, ChildSystemProgressEntryType progressEntryType) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), null, TriggerType.SYSTEM_AUTOMATIC);

    progressEntryService.addSystemProgressEntry(child, progressEntry);
  }
}

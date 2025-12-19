/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.util;

import de.eshg.dental.domain.model.Child;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.progressentry.ProgressEntryService;
import java.util.UUID;
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

  public void addProgressEntryWithPreviousPersonFileStateId(
      Child child, UUID previousPersonFileStateId) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            ChildSystemProgressEntryType.CHILD_MODIFIED.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setPreviousPersonFileStateId(previousPersonFileStateId);

    progressEntryService.addSystemProgressEntry(child, progressEntry);
  }
}

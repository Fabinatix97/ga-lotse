/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;

public class ProgressEntryUtil {
  private ProgressEntryUtil() {}

  public static void addProgressEntry(
      SchoolEntryProcedure procedure, SchoolEntrySystemProgressEntryType progressEntryType) {
    addProgressEntry(procedure, progressEntryType, TriggerType.SYSTEM_AUTOMATIC);
  }

  public static void addProgressEntry(
      SchoolEntryProcedure procedure,
      SchoolEntrySystemProgressEntryType progressEntryType,
      TriggerType triggerType) {
    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), null, triggerType);

    procedure.addProgressEntry(progressEntry);
  }

  public static void addProgressEntry(
      SchoolEntryProcedure procedure,
      SchoolEntrySystemProgressEntryType progressEntryType,
      String changeDescription,
      File file) {
    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), changeDescription, TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setFile(file);
    procedure.addProgressEntry(progressEntry);
  }

  public static void addProgressEntry(
      SchoolEntryProcedure procedure,
      SchoolEntrySystemProgressEntryType progressEntryType,
      File file) {
    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setFile(file);
    procedure.addProgressEntry(progressEntry);
  }
}

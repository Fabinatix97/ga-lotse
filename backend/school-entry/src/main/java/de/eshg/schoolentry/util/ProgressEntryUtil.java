/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.progressentry.ProgressEntryService;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ProgressEntryUtil {
  private final ProgressEntryService<SchoolEntryProcedure> progressEntryService;

  public ProgressEntryUtil(ProgressEntryService<SchoolEntryProcedure> progressEntryService) {
    this.progressEntryService = progressEntryService;
  }

  public void addProgressEntry(
      SchoolEntryProcedure procedure, SchoolEntrySystemProgressEntryType progressEntryType) {
    addProgressEntry(procedure, progressEntryType, TriggerType.SYSTEM_AUTOMATIC);
  }

  public void addProgressEntry(
      SchoolEntryProcedure procedure,
      SchoolEntrySystemProgressEntryType progressEntryType,
      TriggerType triggerType) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), null, triggerType);

    progressEntryService.addSystemProgressEntry(procedure, progressEntry);
  }

  public void addProgressEntry(
      SchoolEntryProcedure procedure,
      SchoolEntrySystemProgressEntryType progressEntryType,
      String changeDescription,
      File file,
      SchoolEntryKeyDocumentType documentType) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), changeDescription, TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setKeyDocumentType(documentType.name());

    progressEntryService.addSystemProgressEntry(procedure, progressEntry, file);
  }

  public void addProgressEntry(
      SchoolEntryProcedure procedure,
      SchoolEntrySystemProgressEntryType progressEntryType,
      File file) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), TriggerType.SYSTEM_AUTOMATIC);

    progressEntryService.addSystemProgressEntry(procedure, progressEntry, file);
  }

  public void addProgressEntry(
      SchoolEntryProcedure procedure,
      SchoolEntrySystemProgressEntryType progressEntryType,
      File file,
      SchoolEntryKeyDocumentType documentType) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setKeyDocumentType(documentType.name());

    progressEntryService.addSystemProgressEntry(procedure, progressEntry, file);
  }

  public void addProgressEntryWithPreviousPersonFileStateId(
      SchoolEntryProcedure procedure,
      SchoolEntrySystemProgressEntryType progressEntryType,
      UUID previousPersonFileStateId) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setPreviousPersonFileStateId(previousPersonFileStateId);

    progressEntryService.addSystemProgressEntry(procedure, progressEntry);
  }
}

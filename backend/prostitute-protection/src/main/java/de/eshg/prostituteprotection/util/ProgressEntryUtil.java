/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.util;

import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.progressentry.ProgressEntryService;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.pdf.PrintDocumentType;
import org.springframework.stereotype.Component;

@Component
public class ProgressEntryUtil {
  private final ProgressEntryService<ProstituteProtectionProcedure> progressEntryService;

  public ProgressEntryUtil(
      ProgressEntryService<ProstituteProtectionProcedure> progressEntryService) {
    this.progressEntryService = progressEntryService;
  }

  public void addSystemProgressEntry(
      ProstituteProtectionProcedure prostituteProtectionProcedure,
      ProstituteProtectionProgressEntryType progressEntryType) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(),
            progressEntryType.getChangeDescription(),
            TriggerType.SYSTEM_AUTOMATIC);

    progressEntryService.addSystemProgressEntry(prostituteProtectionProcedure, progressEntry);
  }

  public void addSystemProgressEntry(
      ProstituteProtectionProcedure procedure,
      ProstituteProtectionProgressEntryType progressEntryType,
      File file,
      PrintDocumentType printDocumentType) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(), TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setKeyDocumentType(printDocumentType.name());

    progressEntryService.addSystemProgressEntry(procedure, progressEntry, file);
  }
}

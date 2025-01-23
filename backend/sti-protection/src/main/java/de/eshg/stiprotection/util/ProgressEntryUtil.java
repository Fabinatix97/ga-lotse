/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.util;

import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.stiprotection.StiProtectionProcedureFinder;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionSystemProgressEntryType;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ProgressEntryUtil {

  private final StiProtectionProcedureFinder procedureFinder;

  public ProgressEntryUtil(StiProtectionProcedureFinder procedureFinder) {
    this.procedureFinder = procedureFinder;
  }

  public void addProgressEntry(
      UUID procedureId,
      StiProtectionSystemProgressEntryType progressEntryType,
      String... changeDescriptionArgs) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType.name(),
            progressEntryType.getChangeDescription().formatted((Object[]) changeDescriptionArgs),
            TriggerType.SYSTEM_AUTOMATIC);
    procedure.addProgressEntry(progressEntry);
  }
}

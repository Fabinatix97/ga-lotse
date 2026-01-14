/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.lib.procedure.cemetery.CemeteryService;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import org.springframework.stereotype.Service;

@Service
public class StiProtectionProcedureDeletionService
    extends ProcedureDeletionService<StiProtectionProcedure> {

  public StiProtectionProcedureDeletionService(
      StiProtectionProcedureRepository stiProtectionProcedureRepository,
      CemeteryService cemeteryService,
      PersonApi personApi,
      FacilityApi facilityApi) {
    super(stiProtectionProcedureRepository, cemeteryService, personApi, facilityApi);
  }

  @Override
  protected void markRelatedFileStatesForDeletion(StiProtectionProcedure procedure) {
    // do nothing
  }

  @Override
  protected void deleteRelatedFileStatesDuringArchiving(StiProtectionProcedure procedure) {
    // do nothing
  }
}

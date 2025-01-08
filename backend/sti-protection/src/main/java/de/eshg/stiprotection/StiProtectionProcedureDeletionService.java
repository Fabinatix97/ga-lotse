/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.procedure.util.CemeteryService;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.util.UUID;
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

  public StiProtectionProcedure find(UUID externalId) {
    return procedureRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure " + externalId + " not found."));
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

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.lib.procedure.cemetery.CemeteryService;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import org.springframework.stereotype.Component;

@Component
public class InspectionDeletionService extends ProcedureDeletionService<Inspection> {

  public InspectionDeletionService(
      InspectionRepository procedureRepository,
      CemeteryService cemeteryService,
      PersonApi personApi,
      FacilityApi facilityApi) {
    super(procedureRepository, cemeteryService, personApi, facilityApi);
  }

  @Override
  public void deleteAndWriteToCemetery(Inspection inspection) {
    if (inspection.getPrecedingInspection() != null) {
      inspection.getPrecedingInspection().setFollowupInspection(null);
    }
    if (inspection.getFollowupInspection() != null) {
      inspection.getFollowupInspection().setPrecedingInspection(null);
    }
    super.deleteAndWriteToCemetery(inspection);
  }
}

/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection;

import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.procedure.util.CemeteryService;
import org.springframework.stereotype.Component;

@Component
public class InspectionDeletionService extends ProcedureDeletionService<Inspection> {

  public InspectionDeletionService(
      InspectionRepository procedureRepository, CemeteryService cemeteryService) {
    super(procedureRepository, cemeteryService);
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

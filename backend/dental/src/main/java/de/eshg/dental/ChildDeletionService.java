/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.procedure.util.CemeteryService;
import org.springframework.stereotype.Component;

@Component
public class ChildDeletionService extends ProcedureDeletionService<Child> {
  public ChildDeletionService(
      ChildRepository childRepository,
      CemeteryService cemeteryService,
      PersonApi personApi,
      FacilityApi facilityApi) {
    super(childRepository, cemeteryService, personApi, facilityApi);
  }

  @Override
  public void deleteAndWriteToCemetery(Child child) {
    for (Examination examination : child.getExaminations()) {
      ProphylaxisSession prophylaxisSession = examination.getProphylaxisSession();
      prophylaxisSession.getExaminations().remove(examination);
      examination.setProphylaxisSession(null);
    }
    super.deleteAndWriteToCemetery(child);
  }
}

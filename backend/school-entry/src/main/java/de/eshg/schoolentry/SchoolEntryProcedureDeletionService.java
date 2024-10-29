/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.procedure.util.CemeteryService;
import de.eshg.schoolentry.domain.model.Anamnesis;
import de.eshg.schoolentry.domain.model.Anamnesis_;
import de.eshg.schoolentry.domain.model.DevelopmentScreening;
import de.eshg.schoolentry.domain.model.DevelopmentScreening_;
import de.eshg.schoolentry.domain.model.EyeExaminationResult;
import de.eshg.schoolentry.domain.model.EyeExaminationResult_;
import de.eshg.schoolentry.domain.model.HearingTestResult;
import de.eshg.schoolentry.domain.model.HearingTestResult_;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SopessExaminationResult;
import de.eshg.schoolentry.domain.model.SopessExaminationResult_;
import de.eshg.schoolentry.domain.model.VaccinationStatus;
import de.eshg.schoolentry.domain.model.VaccinationStatus_;
import de.eshg.schoolentry.domain.model.WaitingRoom;
import de.eshg.schoolentry.domain.model.WaitingRoom_;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SchoolEntryProcedureDeletionService
    extends ProcedureDeletionService<SchoolEntryProcedure> {

  public SchoolEntryProcedureDeletionService(
      ProcedureRepository<SchoolEntryProcedure> procedureRepository,
      CemeteryService cemeteryService) {
    super(procedureRepository, cemeteryService);
  }

  @Override
  protected void deleteAdditionalDependentEntitiesForProcedures(List<Long> internalIds) {
    deleteDependentEntitiesForProcedures(Anamnesis.class, Anamnesis_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        HearingTestResult.class, HearingTestResult_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        EyeExaminationResult.class, EyeExaminationResult_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        SopessExaminationResult.class, SopessExaminationResult_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        DevelopmentScreening.class, DevelopmentScreening_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        VaccinationStatus.class, VaccinationStatus_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(WaitingRoom.class, WaitingRoom_.PROCEDURE, internalIds);
  }
}

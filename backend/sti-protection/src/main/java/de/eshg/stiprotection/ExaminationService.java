/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.examination.RapidTestExamination;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ExaminationService {

  private final StiProtectionProcedureService stiProtectionProcedureService;

  public ExaminationService(StiProtectionProcedureService stiProtectionProcedureService) {
    this.stiProtectionProcedureService = stiProtectionProcedureService;
  }

  public RapidTestExamination getRapidTestExamination(UUID procedureId) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);
    return procedure.getRapidTestExamination();
  }

  public RapidTestExamination getOrCreateRapidTestExamination(UUID procedureId) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);
    return Objects.requireNonNullElseGet(
        procedure.getRapidTestExamination(),
        () -> {
          RapidTestExamination rapidTestExamination = new RapidTestExamination();
          procedure.setRapidTestExamination(rapidTestExamination);
          return rapidTestExamination;
        });
  }
}

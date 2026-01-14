/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestExamination;
import de.eshg.stiprotection.persistence.db.examination.RapidTestExamination;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ExaminationService {

  private final StiProtectionProcedureFinder procedureFinder;

  private final Clock clock;

  public ExaminationService(StiProtectionProcedureFinder procedureFinder, Clock clock) {
    this.procedureFinder = procedureFinder;
    this.clock = clock;
  }

  public RapidTestExamination getRapidTestExamination(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    return procedure.getRapidTestExamination();
  }

  public RapidTestExamination getOrCreateRapidTestExamination(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    return Objects.requireNonNullElseGet(
        procedure.getRapidTestExamination(),
        () -> {
          RapidTestExamination rapidTestExamination = new RapidTestExamination();
          procedure.setRapidTestExamination(rapidTestExamination);
          return rapidTestExamination;
        });
  }

  public LaboratoryTestExamination getLaboratoryTestExamination(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    return procedure.getLaboratoryTestExamination();
  }

  public LaboratoryTestExamination getOrCreateLaboratoryTestExamination(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    return Objects.requireNonNullElseGet(
        procedure.getLaboratoryTestExamination(),
        () -> {
          LaboratoryTestExamination laboratoryTestExamination = new LaboratoryTestExamination();
          procedure.setLaboratoryTestExamination(laboratoryTestExamination);
          return laboratoryTestExamination;
        });
  }

  public void updateTestsConductedDate(
      Boolean testsConducted, LaboratoryTestExamination laboratoryTestExamination) {
    if (Boolean.TRUE.equals(testsConducted)
        && Objects.isNull(laboratoryTestExamination.getTestsConductedDate())) {
      laboratoryTestExamination.setTestsConductedDate(LocalDate.now(clock));
    }
    if (!Boolean.TRUE.equals(testsConducted)
        && Objects.nonNull(laboratoryTestExamination.getTestsConductedDate())) {
      laboratoryTestExamination.setTestsConductedDate(null);
    }
  }
}

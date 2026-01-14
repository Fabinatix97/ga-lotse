/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.stiprotection.persistence.db.Concern;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.medicalhistory.Examination;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexWorkMedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.StiConsultationMedicalHistory;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class MedicalHistoryService {

  private final StiProtectionProcedureFinder procedureFinder;

  public MedicalHistoryService(StiProtectionProcedureFinder procedureFinder) {
    this.procedureFinder = procedureFinder;
  }

  @Transactional
  public MedicalHistory getMedicalHistory(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    return procedure.getMedicalHistory();
  }

  @Transactional
  public MedicalHistory getOrCreateMedicalHistory(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);

    if (procedure.getMedicalHistory() != null) {
      return procedure.getMedicalHistory();
    } else {
      if (procedure.getConcern() == Concern.HIV_STI_CONSULTATION) {
        StiConsultationMedicalHistory stiConsultationMedicalHistory =
            new StiConsultationMedicalHistory();
        stiConsultationMedicalHistory.setExaminations(new Examination());
        procedure.setMedicalHistory(stiConsultationMedicalHistory);
        return stiConsultationMedicalHistory;
      } else {
        SexWorkMedicalHistory sexWorkMedicalHistory = new SexWorkMedicalHistory();
        sexWorkMedicalHistory.setExaminations(new Examination());
        procedure.setMedicalHistory(sexWorkMedicalHistory);
        return sexWorkMedicalHistory;
      }
    }
  }
}

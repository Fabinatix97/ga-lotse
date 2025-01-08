/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.stiprotection.persistence.db.Concern;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexWorkMedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.StiConsultationMedicalHistory;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class MedicalHistoryService {

  private final StiProtectionProcedureService stiProtectionProcedureService;

  public MedicalHistoryService(StiProtectionProcedureService stiProtectionProcedureService) {
    this.stiProtectionProcedureService = stiProtectionProcedureService;
  }

  @Transactional
  public MedicalHistory getMedicalHistory(UUID procedureId) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);
    return procedure.getMedicalHistory();
  }

  @Transactional
  public MedicalHistory getOrCreateMedicalHistory(UUID procedureId) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);

    if (procedure.getMedicalHistory() != null) {
      return procedure.getMedicalHistory();
    } else {
      if (procedure.getConcern() == Concern.HIV_STI_CONSULTATION) {
        StiConsultationMedicalHistory stiConsultationMedicalHistory =
            new StiConsultationMedicalHistory();
        procedure.setMedicalHistory(stiConsultationMedicalHistory);
        return stiConsultationMedicalHistory;
      } else {
        SexWorkMedicalHistory sexWorkMedicalHistory = new SexWorkMedicalHistory();
        procedure.setMedicalHistory(sexWorkMedicalHistory);
        return sexWorkMedicalHistory;
      }
    }
  }
}

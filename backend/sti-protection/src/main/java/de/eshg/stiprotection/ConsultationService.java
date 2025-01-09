/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.consultation.Consultation;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ConsultationService {

  private final StiProtectionProcedureService stiProtectionProcedureService;

  public ConsultationService(StiProtectionProcedureService stiProtectionProcedureService) {
    this.stiProtectionProcedureService = stiProtectionProcedureService;
  }

  public Consultation getConsultation(UUID procedureId) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);
    return procedure.getConsultation();
  }

  public Consultation getOrCreateConsultation(UUID procedureId) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);
    return Objects.requireNonNullElseGet(
        procedure.getConsultation(),
        () -> {
          Consultation consultation = new Consultation();
          procedure.setConsultation(consultation);
          return consultation;
        });
  }
}

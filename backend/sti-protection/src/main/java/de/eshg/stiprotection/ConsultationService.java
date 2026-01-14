/*
 * Copyright 2026 cronn GmbH
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

  private final StiProtectionProcedureFinder procedureFinder;

  public ConsultationService(StiProtectionProcedureFinder procedureFinder) {
    this.procedureFinder = procedureFinder;
  }

  public Consultation getConsultation(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    return procedure.getConsultation();
  }

  public Consultation getOrCreateConsultation(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    return Objects.requireNonNullElseGet(
        procedure.getConsultation(),
        () -> {
          Consultation consultation = new Consultation();
          procedure.setConsultation(consultation);
          return consultation;
        });
  }
}

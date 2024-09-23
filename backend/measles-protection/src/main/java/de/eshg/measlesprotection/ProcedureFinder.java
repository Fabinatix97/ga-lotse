/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedureRepository;
import de.eshg.rest.service.error.NotFoundException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProcedureFinder {

  private final MeaslesProtectionProcedureRepository measlesProtectionProcedureRepository;

  public ProcedureFinder(
      MeaslesProtectionProcedureRepository measlesProtectionProcedureRepository) {
    this.measlesProtectionProcedureRepository = measlesProtectionProcedureRepository;
  }

  @Transactional(readOnly = true)
  public MeaslesProtectionProcedure findProcedureByExternalId(UUID procedureId) {
    return measlesProtectionProcedureRepository
        .findByExternalId(procedureId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "%s with UUID %s not found"
                        .formatted(MeaslesProtectionProcedure.class.getSimpleName(), procedureId)));
  }

  @Transactional(readOnly = true)
  public boolean isOpenProcedure(UUID procedureId) {
    return measlesProtectionProcedureRepository
        .findByExternalId(procedureId)
        .map(Procedure::getProcedureStatus)
        .map(procedureStatus -> ProcedureStatus.isOpen(procedureStatus))
        .orElse(true);
  }
}

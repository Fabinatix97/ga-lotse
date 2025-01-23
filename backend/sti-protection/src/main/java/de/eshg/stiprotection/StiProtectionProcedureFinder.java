/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.rest.service.error.NotFoundException;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class StiProtectionProcedureFinder {
  private final StiProtectionProcedureRepository procedureRepository;

  public StiProtectionProcedureFinder(StiProtectionProcedureRepository procedureRepository) {
    this.procedureRepository = procedureRepository;
  }

  public StiProtectionProcedure findByExternalId(UUID procedureId) {
    return procedureRepository
        .findByExternalId(procedureId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "%s with given UUID not found"
                        .formatted(StiProtectionProcedure.class.getSimpleName())));
  }
}

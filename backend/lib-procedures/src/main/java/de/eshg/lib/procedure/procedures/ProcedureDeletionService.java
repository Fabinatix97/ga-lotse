/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.util.CemeteryService;
import de.eshg.rest.service.error.NotFoundException;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ProcedureDeletionService<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>> {

  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final CemeteryService cemeteryService;

  public ProcedureDeletionService(
      ProcedureRepository<ProcedureT> procedureRepository, CemeteryService cemeteryService) {
    this.procedureRepository = procedureRepository;
    this.cemeteryService = cemeteryService;
  }

  /**
   * Writes a procedure into the cemetery table and afterward deletes it from the productive
   * database tables. The procedure (including all dependent objects) is written to the cemetery
   * table in a serialized form as a json string. Therefore, cyclical dependencies must be avoided
   * or resolved by defining a Jackson mixin in the {@link CemeteryService}.
   *
   * <p>Also, it must be made sure that all dependent objects are automatically deleted when
   * procedure is deleted (e.g. by setting <code>orphanRemoval=true</code>).
   *
   * <p>For the abstract superclass {@link Procedure} it is guaranteed that both above conditions
   * are met. However, everybody who extends {@link Procedure} is responsible to make sure that both
   * requirements are also met for the child class (and to write an according test) before using
   * this method.
   *
   * @param externalId The externalId of the {@link * de.eshg.lib.procedure.domain.model.Procedure}
   *     which should be deleted.
   * @throws NotFoundException if the {@link Procedure} is not found
   */
  @Transactional
  public void deleteProcedure(UUID externalId) {
    ProcedureT procedure =
        procedureRepository
            .findByExternalId(externalId)
            .orElseThrow(() -> new NotFoundException("Procedure " + externalId + " not found."));
    cemeteryService.writeToCemetery(procedure);
    procedureRepository.delete(procedure);
  }
}

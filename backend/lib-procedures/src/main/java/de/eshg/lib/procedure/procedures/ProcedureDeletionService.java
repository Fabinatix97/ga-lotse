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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnMissingBean(ProcedureDeletionService.class)
public class ProcedureDeletionService<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>> {

  private static final Logger log = LoggerFactory.getLogger(ProcedureDeletionService.class);

  protected final ProcedureRepository<ProcedureT> procedureRepository;
  protected final CemeteryService cemeteryService;

  public ProcedureDeletionService(
      ProcedureRepository<ProcedureT> procedureRepository, CemeteryService cemeteryService) {
    this.procedureRepository = procedureRepository;
    this.cemeteryService = cemeteryService;
  }

  /**
   * Writes a procedure (including all dependent objects) into the cemetery table and afterward
   * deletes it from the productive database tables. The procedure is written to the cemetery table
   * in a serialized form as a json string.
   *
   * <p>Every user of this method is responsible for making sure that it works for all procedures it
   * will be used with. This includes (but is not limited to)
   *
   * <p>
   *
   * <ul>
   *   <li>making sure that cascading deletion can work and that there are no unwanted references
   *   <li>extending {@link ProcedureDeletionService} with a custom implementation if necessary
   *       (e.g. if there are procedure-related entities which can not be removed automatically by
   *       cascading deletion and therefore some custom code is needed to remove them)
   *   <li>writing an exhaustive test which asserts that all relevant data constellations can
   *       actually be deleted
   * </ul>
   *
   * @param procedureId The procedureId of the {@link Procedure} which should be written to the
   *     cemetery and then deleted.
   * @throws NotFoundException if the {@link Procedure} is not found
   */
  @Transactional
  public void deleteAndWriteToCemetery(UUID procedureId) {
    deleteAndWriteToCemetery(find(procedureId));
  }

  /** See {@link #deleteAndWriteToCemetery(UUID procedureId)} */
  @Transactional(propagation = Propagation.MANDATORY)
  public void deleteAndWriteToCemetery(ProcedureT procedure) {
    log.info(
        "Attempting to write to cemetery and then delete procedure {}", procedure.getExternalId());
    writeToCemetery(procedure);
    delete(procedure);
  }

  /**
   * Deletes a procedure (including all dependent objects). The procedure is <STRONG>not</STRONG>
   * written to the cemetery.
   *
   * <p>Every user of this method is responsible for making sure that it works for all procedures it
   * will be used with. This includes (but is not limited to)
   *
   * <p>
   *
   * <ul>
   *   <li>making sure that cascading deletion can work and that there are no unwanted references
   *   <li>extending {@link ProcedureDeletionService} with a custom implementation if necessary
   *       (e.g. if there are procedure-related entities which can not be removed automatically by
   *       cascading deletion and therefore some custom code is needed to remove them)
   *   <li>writing an exhaustive test which asserts that all relevant data constellations can
   *       actually be deleted
   * </ul>
   *
   * @param procedureId The procedureId of the {@link Procedure} which should be deleted.
   * @throws NotFoundException if the {@link Procedure} is not found
   */
  @Transactional
  public void delete(UUID procedureId) {
    log.info("Attempting to delete procedure {}", procedureId);
    delete(find(procedureId));
  }

  private ProcedureT find(UUID externalId) {
    return procedureRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure " + externalId + " not found."));
  }

  private void writeToCemetery(ProcedureT procedure) {
    cemeteryService.writeToCemetery(procedure);
    log.info("Procedure {} written to cemetery", procedure.getExternalId());
  }

  private void delete(ProcedureT procedure) {
    procedureRepository.delete(procedure);
    log.info("Procedure {} deleted", procedure.getExternalId());
  }
}

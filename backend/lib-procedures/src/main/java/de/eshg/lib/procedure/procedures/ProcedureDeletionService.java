/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.ProgressEntry_;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.lib.procedure.domain.model.RelatedFacility_;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.model.Task_;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.util.CemeteryService;
import de.eshg.rest.service.error.NotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaDelete;
import jakarta.persistence.criteria.Root;
import java.util.List;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnMissingBean(ProcedureDeletionService.class)
public class ProcedureDeletionService<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>> {

  private static final Logger log = LoggerFactory.getLogger(ProcedureDeletionService.class);

  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final CemeteryService cemeteryService;
  @PersistenceContext private EntityManager entityManager;

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
    log.info("Attempting to write to cemetery and then delete procedure {}", procedureId);
    ProcedureT procedure = find(procedureId);
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
   * @param procedureId The procedureId of the {@link Procedure} which should be written to the
   *     cemetery and then deleted.
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

  @Transactional
  public <
          TaskT extends Task<ProcedureT>,
          PersonT extends RelatedPerson<ProcedureT>,
          FacilityT extends RelatedFacility<ProcedureT>>
      void bulkDeleteAndWriteToCemetery(
          List<ProcedureT> procedures,
          Class<TaskT> taskClass,
          Class<PersonT> personClass,
          Class<FacilityT> facilityTClass) {

    List<Long> internalIds = procedures.stream().map(Procedure::getId).toList();
    if (log.isInfoEnabled()) {
      String idString = internalIds.stream().map(String::valueOf).collect(Collectors.joining(", "));
      log.info("Attempting to write to cemetery and then delete procedures {}", idString);
    }

    cemeteryService.writeToCemetery(procedures);

    deleteDependentEntitiesForProcedures(taskClass, Task_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(personClass, RelatedPerson_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(facilityTClass, RelatedFacility_.PROCEDURE, internalIds);
    deleteProgressEntries(internalIds);

    deleteAdditionalDependentEntitiesForProcedures(internalIds);

    procedureRepository.deleteAllInBatch(procedures);
  }

  protected <T> void deleteDependentEntitiesForProcedures(
      Class<T> dependentEntityClass,
      String procedureAttributeName,
      List<Long> internalProcedureIds) {
    delete(
        dependentEntityClass,
        (delete, root) ->
            delete.where(
                root.join(procedureAttributeName).get(Procedure_.ID).in(internalProcedureIds)));
  }

  private void deleteProgressEntries(List<Long> internalProcedureIds) {
    delete(
        ProgressEntry.class,
        (delete, root) ->
            delete.where(root.get(ProgressEntry_.PROCEDURE_ID).in(internalProcedureIds)));
  }

  private <T> void delete(
      Class<T> dependentEntityClass, BiConsumer<CriteriaDelete<T>, Root<T>> whereClause) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaDelete<T> delete = cb.createCriteriaDelete(dependentEntityClass);
    Root<T> root = delete.from(dependentEntityClass);
    whereClause.accept(delete, root);
    entityManager.createQuery(delete).executeUpdate();
  }

  protected void deleteAdditionalDependentEntitiesForProcedures(List<Long> internalIds) {
    // Extension point for subclasses
  }
}

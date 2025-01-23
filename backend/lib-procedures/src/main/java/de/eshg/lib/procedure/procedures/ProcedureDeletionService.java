/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.lib.procedure.cemetery.CemeteryService;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
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
  protected final PersonApi personApi;
  protected final FacilityApi facilityApi;

  public ProcedureDeletionService(
      ProcedureRepository<ProcedureT> procedureRepository,
      CemeteryService cemeteryService,
      PersonApi personApi,
      FacilityApi facilityApi) {
    this.procedureRepository = procedureRepository;
    this.cemeteryService = cemeteryService;
    this.personApi = personApi;
    this.facilityApi = facilityApi;
  }

  /**
   * Writes a procedure (including all dependent objects) into the cemetery table and afterward
   * deletes it from the productive database tables. The procedure is written to the cemetery table
   * in a serialized form as a json string. Finally, after the specified {@code retentionPeriod} has
   * passed, it will also be deleted from the cemetery table.
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
   * @param procedure The {@link Procedure} which should be written to the cemetery and then
   *     deleted.
   * @param retentionPeriod The time period after which the {@link Procedure} should also be deleted
   *     from the cemetery table. If <code>null</code>, a default retention period will be used (see
   *     {@link CemeteryService}).
   * @throws NotFoundException if the {@link Procedure} is not found
   */
  @Transactional(propagation = Propagation.MANDATORY)
  public void deleteAndWriteToCemetery(ProcedureT procedure, Period retentionPeriod) {
    log.info(
        "Attempting to write to cemetery and then delete procedure {}", procedure.getExternalId());
    cemeteryService.writeToCemetery(procedure, retentionPeriod);
    markRelatedFileStatesForDeletion(procedure);
    procedureRepository.delete(procedure);
    log.info("Procedure {} written to cemetery and deleted", procedure.getExternalId());
  }

  /**
   * A convenience method which does exactly the same as {@link
   * ProcedureDeletionService#deleteAndWriteToCemetery(Procedure, Period)}
   *
   * @param procedure
   */
  @Transactional(propagation = Propagation.MANDATORY)
  public void deleteAndWriteToCemetery(ProcedureT procedure) {
    deleteAndWriteToCemetery(procedure, null);
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
   * @param procedure The {@link Procedure} which should be deleted.
   * @throws NotFoundException if the {@link Procedure} is not found
   */
  @Transactional(propagation = Propagation.MANDATORY)
  public void deleteDuringArchiving(ProcedureT procedure) {
    log.info("Attempting to delete procedure {}", procedure.getExternalId());
    deleteRelatedFileStatesDuringArchiving(procedure);
    procedureRepository.delete(procedure);
    log.info("Procedure {} deleted", procedure.getExternalId());
  }

  protected void markRelatedFileStatesForDeletion(ProcedureT procedure) {
    if (!procedure.getRelatedPersons().isEmpty()) {
      log.debug(
          "Attempting to mark {} related persons for deletion. ",
          procedure.getRelatedPersons().size());
      personApi.markPersonFileStateForDeletion(
          deletionRequest(procedure.getRelatedPersons(), RelatedPerson::getCentralFileStateId));
    }
    if (!procedure.getRelatedFacilities().isEmpty()) {
      log.debug(
          "Attempting to mark {} related facilities for deletion",
          procedure.getRelatedFacilities().size());
      facilityApi.markFacilityFileStateForDeletion(
          deletionRequest(
              procedure.getRelatedFacilities(), RelatedFacility::getCentralFileStateId));
    }
  }

  protected void deleteRelatedFileStatesDuringArchiving(ProcedureT procedure) {
    if (!procedure.getRelatedPersons().isEmpty()) {
      log.debug("Attempting to delete {} related persons", procedure.getRelatedPersons().size());
      personApi.deletePersonFileStateDuringArchive(
          deletionRequest(procedure.getRelatedPersons(), RelatedPerson::getCentralFileStateId));
    }
    if (!procedure.getRelatedFacilities().isEmpty()) {
      log.debug(
          "Attempting to delete {} related facilities", procedure.getRelatedFacilities().size());
      facilityApi.deleteFacilityFileStateDuringArchive(
          deletionRequest(
              procedure.getRelatedFacilities(), RelatedFacility::getCentralFileStateId));
    }
  }

  private <T> DeleteFileStatesRequest deletionRequest(
      List<T> entities, Function<T, UUID> uuidExtractor) {
    return new DeleteFileStatesRequest(
        entities.stream().map(uuidExtractor).collect(Collectors.toSet()));
  }
}

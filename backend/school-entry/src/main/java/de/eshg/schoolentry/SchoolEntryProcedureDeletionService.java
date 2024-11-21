/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.ProgressEntry_;
import de.eshg.lib.procedure.domain.model.RelatedFacility_;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import de.eshg.lib.procedure.domain.model.Task_;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.procedure.util.CemeteryService;
import de.eshg.schoolentry.client.PersonClient;
import de.eshg.schoolentry.domain.model.Anamnesis;
import de.eshg.schoolentry.domain.model.Anamnesis_;
import de.eshg.schoolentry.domain.model.DevelopmentScreening;
import de.eshg.schoolentry.domain.model.DevelopmentScreening_;
import de.eshg.schoolentry.domain.model.EyeExaminationResult;
import de.eshg.schoolentry.domain.model.EyeExaminationResult_;
import de.eshg.schoolentry.domain.model.Facility;
import de.eshg.schoolentry.domain.model.HearingTestResult;
import de.eshg.schoolentry.domain.model.HearingTestResult_;
import de.eshg.schoolentry.domain.model.Person;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryTask;
import de.eshg.schoolentry.domain.model.SopessExaminationResult;
import de.eshg.schoolentry.domain.model.SopessExaminationResult_;
import de.eshg.schoolentry.domain.model.VaccinationStatus;
import de.eshg.schoolentry.domain.model.VaccinationStatus_;
import de.eshg.schoolentry.domain.model.WaitingRoom;
import de.eshg.schoolentry.domain.model.WaitingRoom_;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaDelete;
import jakarta.persistence.criteria.Root;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SchoolEntryProcedureDeletionService
    extends ProcedureDeletionService<SchoolEntryProcedure> {

  private static final Logger log =
      LoggerFactory.getLogger(SchoolEntryProcedureDeletionService.class);

  @PersistenceContext private EntityManager entityManager;
  private final PersonClient personClient;
  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;

  public SchoolEntryProcedureDeletionService(
      ProcedureRepository<SchoolEntryProcedure> procedureRepository,
      CemeteryService cemeteryService,
      PersonClient personClient,
      SchoolEntryProcedureRepository schoolEntryProcedureRepository) {
    super(procedureRepository, cemeteryService);
    this.personClient = personClient;
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
  }

  @Override
  public void deleteAndWriteToCemetery(SchoolEntryProcedure procedure) {
    markRelatedPersonsForDeletionInCentralFile(List.of(procedure));
    super.deleteAndWriteToCemetery(procedure);
  }

  private void markRelatedPersonsForDeletionInCentralFile(List<SchoolEntryProcedure> procedures) {
    UUID[] personIds =
        procedures.stream()
            .map(Procedure::getRelatedPersons)
            .flatMap(List::stream)
            .map(RelatedPerson::getCentralFileStateId)
            .toArray(UUID[]::new);
    if (log.isInfoEnabled()) {
      log.info("Marking central file state(s) {} for deletion", Arrays.toString(personIds));
    }
    personClient.markCentralFileStatesForDeletion(personIds);
    if (log.isInfoEnabled()) {
      log.info("Marked central file state(s) {} for deletion", Arrays.toString(personIds));
    }
  }

  @Transactional
  public void bulkDeleteAndWriteToCemetery(List<UUID> procedureIds) {
    List<SchoolEntryProcedure> procedures =
        schoolEntryProcedureRepository.findForBatchDeletion(procedureIds);
    markRelatedPersonsForDeletionInCentralFile(procedures);

    List<Long> internalIds = procedures.stream().map(Procedure::getId).toList();
    if (log.isInfoEnabled()) {
      String idString = internalIds.stream().map(String::valueOf).collect(Collectors.joining(", "));
      log.info("Attempting to write to cemetery and then delete procedures {}", idString);
    }

    cemeteryService.writeToCemetery(procedures);

    deleteDependentEntitiesForProcedures(SchoolEntryTask.class, Task_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(Person.class, RelatedPerson_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(Facility.class, RelatedFacility_.PROCEDURE, internalIds);
    deleteProgressEntries(internalIds);

    deleteDependentEntitiesForProcedures(Anamnesis.class, Anamnesis_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        HearingTestResult.class, HearingTestResult_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        EyeExaminationResult.class, EyeExaminationResult_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        SopessExaminationResult.class, SopessExaminationResult_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        DevelopmentScreening.class, DevelopmentScreening_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(
        VaccinationStatus.class, VaccinationStatus_.PROCEDURE, internalIds);
    deleteDependentEntitiesForProcedures(WaitingRoom.class, WaitingRoom_.PROCEDURE, internalIds);

    procedureRepository.deleteAllInBatch(procedures);
  }

  private <T> void deleteDependentEntitiesForProcedures(
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
}

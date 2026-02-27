/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import com.google.common.collect.Streams;
import com.google.common.util.concurrent.Uninterruptibles;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.persistence.TransactionHelper;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.SequencedMap;
import java.util.UUID;
import java.util.function.Function;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SchoolEntryChildAgeMigration {

  private static final Logger log = LoggerFactory.getLogger(SchoolEntryChildAgeMigration.class);
  private static final int BATCH_SIZE = 100;

  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final TransactionHelper transactionHelper;
  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final Clock clock;
  private final PersonApi personApi;

  public SchoolEntryChildAgeMigration(
      ModuleClientAuthenticator moduleClientAuthenticator,
      TransactionHelper transactionHelper,
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      Clock clock,
      PersonApi personApi) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.transactionHelper = transactionHelper;
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.clock = clock;
    this.personApi = personApi;
  }

  @Scheduled(initialDelay = 15 * 60 * 1000)
  @SchedulerLock(name = "SchoolEntryChildAgeMigrationJob", lockAtMostFor = "23h")
  public void execute() {
    LockAssert.assertLocked();
    BatchResult batchResult = new BatchResult(0, 0, true);

    log.info("Starting migration of child age for school entry procedures.");
    int totalMigrated = 0;
    while (batchResult.hasNext()) {
      log.info("Processing batch starting with ID {}", batchResult.lastProcessedId());
      batchResult = processBatchInTransaction(batchResult.lastProcessedId());
      log.info(
          "Processed batch with {} procedures ending with ID {}.",
          batchResult.migratedProcedure(),
          batchResult.lastProcessedId());
      totalMigrated += batchResult.migratedProcedure();
      Uninterruptibles.sleepUninterruptibly(Duration.ofSeconds(60));
    }
    log.info(
        "Child age migration for school entry procedures finished. migrated {} procedures in total.",
        totalMigrated);
  }

  private BatchResult processBatchInTransaction(long previousId) {
    return transactionHelper.executeInTransaction(() -> processBatch(previousId));
  }

  private BatchResult processBatch(long previousId) {
    Slice<SchoolEntryProcedure> batch =
        schoolEntryProcedureRepository
            .findByIdGreaterThanAndAppointmentIsNotNullAndChildAgeIsNullOrderByIdAsc(
                previousId, PageRequest.of(0, BATCH_SIZE));
    if (batch.isEmpty()) {
      log.info("No more procedures to migrate");
      return new BatchResult(0, previousId, false);
    }
    List<ProcedureWithPerson> proceduresWithPerson = fetchAssociatedChildIds(batch);
    for (ProcedureWithPerson procedureWithPerson : proceduresWithPerson) {
      migrateProcedure(procedureWithPerson);
    }

    Long lastId = Streams.findLast(batch.stream()).orElseThrow().getId();
    return new BatchResult(batch.getNumberOfElements(), lastId, batch.hasNext());
  }

  private List<ProcedureWithPerson> fetchAssociatedChildIds(Slice<SchoolEntryProcedure> batch) {
    SequencedMap<UUID, SchoolEntryProcedure> personByFileStateId =
        batch.stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    SchoolEntryProcedure::getChildIdFromCentralFile, Function.identity()));

    List<UUID> personIdsToFetch =
        batch.stream().map(SchoolEntryProcedure::getChildIdFromCentralFile).toList();

    return moduleClientAuthenticator
        .doWithModuleClientAuthentication(
            () ->
                getPersonFileStates(personIdsToFetch).entrySet().stream()
                    .map(
                        personeFileStateResponse ->
                            new ProcedureWithPerson(
                                personByFileStateId.get(personeFileStateResponse.getKey()),
                                personeFileStateResponse.getValue())))
        .toList();
  }

  private void migrateProcedure(ProcedureWithPerson procedureWithPerson) {
    Integer calculatedChildAge =
        Period.between(
                procedureWithPerson.personeFileStateResponse.dateOfBirth(),
                procedureWithPerson
                    .procedure
                    .getAppointment()
                    .getAppointmentStart()
                    .atZone(clock.getZone())
                    .toLocalDate())
            .getYears();

    procedureWithPerson.procedure.setChildAge(calculatedChildAge);
  }

  private Map<UUID, GetPersonFileStateResponse> getPersonFileStates(List<UUID> personFileStateIds) {
    return personApi
        .getPersonFileStates(new GetPersonFileStatesRequest(personFileStateIds))
        .personFileStates()
        .stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  private record BatchResult(int migratedProcedure, long lastProcessedId, boolean hasNext) {}

  private record ProcedureWithPerson(
      SchoolEntryProcedure procedure, GetPersonFileStateResponse personeFileStateResponse) {}
}

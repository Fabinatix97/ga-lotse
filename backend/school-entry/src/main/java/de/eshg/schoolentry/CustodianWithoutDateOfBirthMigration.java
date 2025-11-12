/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import com.google.common.collect.Streams;
import com.google.common.util.concurrent.Uninterruptibles;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.PersonWithoutDateOfBirthApi;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.person.AddPersonWithoutDateOfBirthRequest;
import de.eshg.base.centralfile.api.person.AddPersonsWithoutDateOfBirthRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonWithoutDateOfBirthResponse;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.persistence.TransactionHelper;
import de.eshg.schoolentry.domain.model.Person;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.util.Streamable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CustodianWithoutDateOfBirthMigration {

  private static final Logger log =
      LoggerFactory.getLogger(CustodianWithoutDateOfBirthMigration.class);
  private static final int BATCH_SIZE = 50;
  private static final LocalDate PLACEHOLDER_DATE_OF_BIRTH = LocalDate.of(1900, 1, 1);

  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final TransactionHelper transactionHelper;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final PersonWithoutDateOfBirthApi personWithoutDateOfBirthApi;
  private final PersonApi personApi;

  public CustodianWithoutDateOfBirthMigration(
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      TransactionHelper transactionHelper,
      ModuleClientAuthenticator moduleClientAuthenticator,
      PersonWithoutDateOfBirthApi personWithoutDateOfBirthApi,
      PersonApi personApi) {
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.transactionHelper = transactionHelper;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.personWithoutDateOfBirthApi = personWithoutDateOfBirthApi;
    this.personApi = personApi;
  }

  @Scheduled(initialDelay = 15 * 60 * 1000)
  @SchedulerLock(name = "SchoolEntryCustodianWithoutDateOfBirthMigrationJob", lockAtMostFor = "23h")
  public void execute() {
    LockAssert.assertLocked();
    BatchResult batchResult = new BatchResult(0, 0, 0, true);

    log.info("Starting custodian without date of birth migration");
    while (batchResult.hasNext()) {
      log.info("Processing batch starting with ID {}", batchResult.lastProcessedId());
      batchResult = processBatchInTransaction(batchResult.lastProcessedId());
      log.info(
          "Processed batch with {} processes ending with ID {}. migrated {} custodians.",
          batchResult.processedProcedures(),
          batchResult.lastProcessedId(),
          batchResult.migratedPersons());
      Uninterruptibles.sleepUninterruptibly(Duration.ofSeconds(60));
    }
    log.info("Custodian without date of birth migration finished");
  }

  private BatchResult processBatchInTransaction(long previousId) {
    return transactionHelper.executeInTransaction(() -> processBatch(previousId));
  }

  private BatchResult processBatch(long previousId) {
    Slice<SchoolEntryProcedure> batch =
        schoolEntryProcedureRepository.findByIdGreaterThanOrderByIdAsc(
            previousId, PageRequest.of(0, BATCH_SIZE));
    if (batch.isEmpty()) {
      log.info("No more procedures to migrate");
      return new BatchResult(0, 0, previousId, false);
    }

    Long lastId = Streams.findLast(batch.stream()).orElseThrow().getId();

    List<GetPersonFileStateResponse> custodiansToMigrate = collectCustodiansToMigrate(batch);
    if (custodiansToMigrate.isEmpty()) {
      log.info("No custodians to migrate in this batch");
      return new BatchResult(batch.getNumberOfElements(), 0, lastId, batch.hasNext());
    }

    Map<UUID, GetPersonWithoutDateOfBirthResponse> personMap =
        createCustodiansWithoutDateOfBirthInCentralFile(custodiansToMigrate);

    for (SchoolEntryProcedure entity : batch) {
      migrateProcedure(entity, personMap);
    }

    markMigratedPersonsWithDateOfBirthForDeletionInCentralFile(custodiansToMigrate);

    return new BatchResult(batch.getNumberOfElements(), personMap.size(), lastId, batch.hasNext());
  }

  private void markMigratedPersonsWithDateOfBirthForDeletionInCentralFile(
      List<GetPersonFileStateResponse> custodiansToMigrate) {
    DeleteFileStatesRequest request =
        new DeleteFileStatesRequest(
            custodiansToMigrate.stream()
                .map(GetPersonFileStateResponse::id)
                .collect(Collectors.toUnmodifiableSet()));
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> personApi.markPersonFileStateForDeletion(request));
  }

  private Map<UUID, GetPersonWithoutDateOfBirthResponse>
      createCustodiansWithoutDateOfBirthInCentralFile(
          List<GetPersonFileStateResponse> custodiansToMigrate) {
    AddPersonsWithoutDateOfBirthRequest request =
        new AddPersonsWithoutDateOfBirthRequest(
            custodiansToMigrate.stream()
                .map(CustodianWithoutDateOfBirthMigration::mapPerson)
                .toList());
    List<GetPersonWithoutDateOfBirthResponse> custodiansWithoutDateOfBirth =
        moduleClientAuthenticator
            .doWithModuleClientAuthentication(
                () -> personWithoutDateOfBirthApi.addPersonsWithoutDateOfBirth(request))
            .personsWithoutDateOfBirth();

    return IntStream.range(0, custodiansToMigrate.size())
        .boxed()
        .collect(
            StreamUtil.toLinkedHashMap(
                i -> custodiansToMigrate.get(i).id(), custodiansWithoutDateOfBirth::get));
  }

  private List<GetPersonFileStateResponse> collectCustodiansToMigrate(
      Streamable<SchoolEntryProcedure> batch) {
    List<UUID> custodiansIds =
        batch.stream()
            .flatMap(SchoolEntryProcedure::getCustodians)
            .map(Person::getCentralFileStateId)
            .toList();

    if (custodiansIds.isEmpty()) {
      return List.of();
    }

    GetPersonFileStatesRequest request = new GetPersonFileStatesRequest(custodiansIds);
    GetPersonFileStatesResponse custodians =
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () -> personApi.getPersonFileStates(request));
    if (!custodians.notFoundIds().isEmpty()) {
      log.warn("Some custodians were not found in the central file: {}", custodians.notFoundIds());
    }

    return custodians.personFileStates().stream()
        .filter(custodian -> custodian.dateOfBirth().equals(PLACEHOLDER_DATE_OF_BIRTH))
        .toList();
  }

  private static AddPersonWithoutDateOfBirthRequest mapPerson(GetPersonFileStateResponse p) {
    if (p.nameAtBirth() != null) {
      log.warn("Person {}: Name at birth will be discarded", p.id());
    }
    if (p.placeOfBirth() != null) {
      log.warn("Person {}: Place of birth will be discarded", p.id());
    }
    if (p.countryOfBirth() != null) {
      log.warn("Person {}: Country of birth will be discarded", p.id());
    }
    if (p.differentBillingAddress() != null) {
      log.warn("Person {}: Different billing address will be discarded", p.id());
    }
    return new AddPersonWithoutDateOfBirthRequest(
        p.title(),
        p.salutation(),
        p.gender(),
        p.firstName(),
        p.lastName(),
        p.emailAddresses(),
        p.phoneNumbers(),
        p.contactAddress(),
        p.dataOrigin());
  }

  private static void migrateProcedure(
      SchoolEntryProcedure procedure,
      Map<UUID, GetPersonWithoutDateOfBirthResponse> relatedPersonsToMigrate) {
    procedure
        .getRelatedPersons()
        .removeIf(
            relatedPerson -> {
              GetPersonWithoutDateOfBirthResponse personWithoutDateOfBirth =
                  relatedPersonsToMigrate.get(relatedPerson.getCentralFileStateId());
              if (personWithoutDateOfBirth == null) {
                return false;
              }
              procedure.getCustodianWithoutDob().add(personWithoutDateOfBirth.id());
              log.info(
                  "Migrated custodian {} for procedure {} to custodian without date of birth {}",
                  relatedPerson.getCentralFileStateId(),
                  procedure.getId(),
                  personWithoutDateOfBirth.id());
              return true;
            });
  }

  private record BatchResult(
      int processedProcedures, int migratedPersons, long lastProcessedId, boolean hasNext) {}
}

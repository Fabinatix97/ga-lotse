/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import com.google.common.collect.Streams;
import com.google.common.util.concurrent.Uninterruptibles;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.dental.client.PersonClient;
import de.eshg.dental.domain.model.BooleanWithUnknown;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.FluoridationConsent;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.persistence.TransactionHelper;
import java.time.Duration;
import java.util.HashSet;
import java.util.List;
import java.util.SequencedMap;
import java.util.Set;
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
public class CurrentFluoridationConsentMigration {

  private static final Logger log =
      LoggerFactory.getLogger(CurrentFluoridationConsentMigration.class);
  private static final int BATCH_SIZE = 100;

  private final Set<Long> migratedIds = new HashSet<>();
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final TransactionHelper transactionHelper;
  private final ChildRepository childRepository;
  private final ChildService childService;
  private final PersonClient personClient;

  public CurrentFluoridationConsentMigration(
      ModuleClientAuthenticator moduleClientAuthenticator,
      TransactionHelper transactionHelper,
      ChildRepository childRepository,
      ChildService childService,
      PersonClient personClient) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.transactionHelper = transactionHelper;
    this.childRepository = childRepository;
    this.childService = childService;
    this.personClient = personClient;
  }

  @Scheduled(initialDelay = 15 * 60 * 1000)
  @SchedulerLock(name = "CurrentFluoridationConsentMigrationJob", lockAtMostFor = "23h")
  public void execute() {
    LockAssert.assertLocked();
    migratedIds.clear();
    BatchResult batchResult = new BatchResult(0, 0, true);

    log.info("Starting current fluoridation consent migration");
    while (batchResult.hasNext()) {
      log.info("Processing batch starting with ID {}", batchResult.lastProcessedId());
      batchResult = processBatchInTransaction(batchResult.lastProcessedId());
      log.info(
          "Processed batch with {} children ending with ID {}.",
          batchResult.migratedChildren(),
          batchResult.lastProcessedId());
      Uninterruptibles.sleepUninterruptibly(Duration.ofSeconds(60));
    }
    log.info(
        "Current fluoridation consent migration finished. migrated {} children in total.",
        migratedIds.size());
    migratedIds.clear();
  }

  private BatchResult processBatchInTransaction(long previousId) {
    return transactionHelper.executeInTransaction(() -> processBatch(previousId));
  }

  private BatchResult processBatch(long previousId) {
    Slice<Child> batch =
        childRepository.findByIdGreaterThanOrderByIdAsc(previousId, PageRequest.of(0, BATCH_SIZE));
    if (batch.isEmpty()) {
      log.info("No more children to migrate");
      return new BatchResult(0, previousId, false);
    }

    List<ChildWithAssociatedFileStateIds> childrenWithAssociatedFileStateIds =
        fetchAssociatedChildIds(batch);

    int migratedChildren = 0;
    for (ChildWithAssociatedFileStateIds childWithAssociatedFileStateIds :
        childrenWithAssociatedFileStateIds) {
      migratedChildren += migrateChildren(childWithAssociatedFileStateIds);
    }

    Long lastId = Streams.findLast(batch.stream()).orElseThrow().getId();
    return new BatchResult(migratedChildren, lastId, batch.hasNext());
  }

  private List<ChildWithAssociatedFileStateIds> fetchAssociatedChildIds(Slice<Child> batch) {
    SequencedMap<UUID, Child> childrenByFileStateId =
        batch.stream()
            .collect(
                StreamUtil.toLinkedHashMap(Child::getChildIdFromCentralFile, Function.identity()));

    return moduleClientAuthenticator
        .doWithModuleClientAuthentication(
            () ->
                personClient.fetchAssociatedExternalIdsInBulk(
                    batch.stream().map(Child::getChildIdFromCentralFile).toList()))
        .entrySet()
        .stream()
        .map(
            entry ->
                new ChildWithAssociatedFileStateIds(
                    childrenByFileStateId.get(entry.getKey()), entry.getValue()))
        .toList();
  }

  private int migrateChildren(ChildWithAssociatedFileStateIds child) {
    if (migratedIds.contains(child.child().getId())) return 0;

    List<Child> associatedChildren =
        childRepository.findByRelatedPersonsCentralFileStateId(child.associatedFileStateIds());

    BooleanWithUnknown currentConsent = getCurrentConsent(associatedChildren);

    associatedChildren.forEach(
        c -> {
          c.setCurrentFluoridationConsent(currentConsent);
          migratedIds.add(c.getId());
        });
    return associatedChildren.size();
  }

  private BooleanWithUnknown getCurrentConsent(List<Child> associatedChildren) {
    List<FluoridationConsent> fluoridationConsents =
        childService.getAllFluoridationConsents(associatedChildren);
    return fluoridationConsents.stream()
        .map(FluoridationConsent::getConsented)
        .findFirst()
        .orElse(BooleanWithUnknown.UNKNOWN);
  }

  private record BatchResult(int migratedChildren, long lastProcessedId, boolean hasNext) {}

  private record ChildWithAssociatedFileStateIds(Child child, List<UUID> associatedFileStateIds) {}
}

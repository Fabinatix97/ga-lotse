/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.housekeeping.archiving;

import static de.eshg.lib.procedure.domain.model.ArchivingRelevance.IRRELEVANT;
import static java.time.temporal.ChronoUnit.DAYS;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.procedure.domain.model.ArchivingRelevance;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.domain.specification.ArchivableProceduresSpecifications;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArchivingJob<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>> {

  private static final Logger logger = LoggerFactory.getLogger(ArchivingJob.class);
  private final ArchivingProperties archivingProperties;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final ArchivableProceduresSpecifications<ProcedureT> archivableProceduresSpecifications;
  private final ProcedureDeletionService<ProcedureT> procedureDeletionService;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final Clock clock;

  public ArchivingJob(
      ArchivingProperties archivingProperties,
      ProcedureRepository<ProcedureT> procedureRepository,
      ArchivableProceduresSpecifications<ProcedureT> archivableProceduresSpecifications,
      ProcedureDeletionService<ProcedureT> procedureDeletionService,
      ModuleClientAuthenticator moduleClientAuthenticator,
      Clock clock) {
    this.archivingProperties = archivingProperties;
    this.procedureRepository = procedureRepository;
    this.archivableProceduresSpecifications = archivableProceduresSpecifications;
    this.procedureDeletionService = procedureDeletionService;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.clock = clock;
  }

  @Transactional
  @Scheduled(cron = "${de.eshg.lib.procedure.housekeeping.archiving.schedule:@daily}")
  @SchedulerLock(
      name = "LibProceduresArchivingJob",
      lockAtMostFor = "${de.eshg.lib.procedure.housekeeping.archiving.lock-at-most-for:23h}")
  public void run() {
    LockAssert.assertLocked();
    boolean withinGracePeriod = isWithinGracePeriod();
    logger.info(
        "Started with grace period of {} months, is within grace period: {}",
        archivingProperties.getGracePeriodMonthsOrDefault(),
        withinGracePeriod);

    if (!withinGracePeriod) {
      updateProcedures();
    }

    List<ProcedureT> proceduresRelevantForDeletion = getProceduresRelevantForDeletion();

    proceduresRelevantForDeletion.forEach(this::assertClosedBeforeArchivingPeriodInstant);

    logger.info("Procedures to be deleted: {}", getProcedureIds(proceduresRelevantForDeletion));

    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> deleteProcedures(proceduresRelevantForDeletion));

    logger.info("Succeeded");
  }

  private void deleteProcedures(Collection<ProcedureT> procedures) {
    for (ProcedureT procedure : procedures) {
      try {
        procedureDeletionService.deleteDuringArchiving(procedure);
      } catch (Exception e) {
        logger.error("Deleting procedure {} failed", procedure.getExternalId(), e);
      }
    }
  }

  private void updateProcedures() {
    List<ProcedureT> proceduresRelevantForUpdate =
        procedureRepository.findAll(
            archivableProceduresSpecifications
                .procedureIsArchivable()
                .and(archivableProceduresSpecifications.procedureHasArchivingRelevanceDefault()));

    logger.info("Procedures to be updated: {}", getProcedureIds(proceduresRelevantForUpdate));

    for (ProcedureT procedure : proceduresRelevantForUpdate) {
      ArchivingRelevance configuredDefaultRelevance =
          archivingProperties.getDefaultArchivingRelevanceOrElseFallback(
              procedure.getProcedureType());
      procedure.setArchivingRelevance(configuredDefaultRelevance);
    }
  }

  private void assertClosedBeforeArchivingPeriodInstant(ProcedureT procedure) {
    Instant closedAt = procedure.getClosedAt();
    Instant archivingPeriodInstant = getArchivingPeriodInstant(procedure);

    if (!closedAt.isBefore(archivingPeriodInstant)) {
      throw new IllegalStateException(
          "Procedure [externalId=%s, closedAt=%s] was not closed before archiving period instant %s"
              .formatted(procedure.getExternalId(), closedAt, archivingPeriodInstant));
    }
  }

  private Instant getArchivingPeriodInstant(ProcedureT procedure) {
    Period archivingPeriod =
        archivingProperties.getDefaultArchivingPeriodOrElseDefault(procedure.getProcedureType());

    return ZonedDateTime.now(clock)
        .withDayOfYear(1)
        .truncatedTo(DAYS)
        .minus(archivingPeriod)
        .toInstant();
  }

  private List<ProcedureT> getProceduresRelevantForDeletion() {
    return procedureRepository.findAllByArchivingRelevance(IRRELEVANT);
  }

  private Set<Long> getProcedureIds(Collection<ProcedureT> procedures) {
    return procedures.stream().map(GenericEntity::getId).collect(Collectors.toSet());
  }

  private boolean isWithinGracePeriod() {
    return LocalDate.ofInstant(Instant.now(clock), clock.getZone()).getMonthValue()
        <= archivingProperties.getGracePeriodMonthsOrDefault();
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.housekeeping.archiving;

import static de.eshg.lib.procedure.domain.model.ArchivingRelevance.IRRELEVANT;
import static java.time.temporal.ChronoUnit.DAYS;
import static org.springframework.data.jpa.domain.Specification.where;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.domain.specification.ArchivableProceduresSpecification;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ArchivingJob<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>> {

  private static final Logger logger = LoggerFactory.getLogger(ArchivingJob.class);
  private final ArchivingProperties archivingProperties;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final ArchivableProceduresSpecification<ProcedureT> archivableProceduresSpecification;
  private final ArchivingJobService<ProcedureT> archivingJobService;
  private final Clock clock;

  public ArchivingJob(
      ArchivingProperties archivingProperties,
      ProcedureRepository<ProcedureT> procedureRepository,
      ArchivableProceduresSpecification<ProcedureT> archivableProceduresSpecification,
      ArchivingJobService<ProcedureT> archivingJobService,
      Clock clock) {
    this.archivingProperties = archivingProperties;
    this.procedureRepository = procedureRepository;
    this.archivableProceduresSpecification = archivableProceduresSpecification;
    this.archivingJobService = archivingJobService;
    this.clock = clock;
  }

  @Scheduled(cron = "${de.eshg.lib.procedure.housekeeping.archiving.schedule}")
  public void run() {
    boolean withinGracePeriod = isWithinGracePeriod();
    logger.info(
        "Started with grace period of {} months, is within grace period: {}",
        archivingProperties.getGracePeriodMonthsOrDefault(),
        withinGracePeriod);

    if (!withinGracePeriod) {
      List<ProcedureT> proceduresRelevantForUpdate =
          procedureRepository.findAll(
              where(archivableProceduresSpecification)
                  .and(archivableProceduresSpecification.procedureHasArchivingRelevanceDefault()));

      logger.info("Procedures to be updated: {}", getProcedureIds(proceduresRelevantForUpdate));

      archivingJobService.updateProcedures();
    }

    List<ProcedureT> proceduresRelevantForDeletion = getProceduresRelevantForDeletion();

    proceduresRelevantForDeletion.forEach(this::assertClosedBeforeArchivingPeriodInstant);

    logger.info("Procedures to be deleted: {}", getProcedureIds(proceduresRelevantForDeletion));

    archivingJobService.deleteProcedures(proceduresRelevantForDeletion);

    logger.info("Succeeded");
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

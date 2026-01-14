/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.specification;

import static de.eshg.lib.procedure.domain.model.Procedure_.archivingRelevance;
import static de.eshg.lib.procedure.domain.model.Procedure_.closedAt;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureStatus;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureType;
import static de.eshg.lib.procedure.housekeeping.archiving.ArchivingProperties.DEFAULT_ARCHIVING_PERIOD;
import static java.time.temporal.ChronoUnit.DAYS;

import de.eshg.lib.procedure.domain.model.ArchivingRelevance;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.housekeeping.archiving.ArchivingProperties;
import de.eshg.lib.procedure.housekeeping.archiving.ArchivingProperties.Details;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaBuilder.SimpleCase;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.Clock;
import java.time.Instant;
import java.time.Period;
import java.time.ZonedDateTime;
import java.util.Map.Entry;
import org.springframework.data.jpa.domain.Specification;

public class ArchivableProceduresSpecifications<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>> {

  private final ArchivingProperties archivingProperties;
  private final Clock clock;

  public ArchivableProceduresSpecifications(ArchivingProperties archivingProperties, Clock clock) {
    this.archivingProperties = archivingProperties;
    this.clock = clock;
  }

  public Specification<ProcedureT> procedureIsArchivable() {
    return (procedure, query, cb) ->
        cb.and(
            procedureIsClosed(procedure, cb), closedAtBeforeArchivingPeriodInstant(procedure, cb));
  }

  private Predicate procedureIsClosed(Root<ProcedureT> procedure, CriteriaBuilder cb) {
    return cb.equal(procedure.get(procedureStatus), cb.literal(ProcedureStatus.CLOSED));
  }

  private Predicate closedAtBeforeArchivingPeriodInstant(
      Root<ProcedureT> procedure, CriteriaBuilder cb) {
    if (archivingProperties.details().isEmpty()) {
      return cb.lessThan(
          procedure.get(closedAt), cb.literal(getArchivingPeriodInstant(DEFAULT_ARCHIVING_PERIOD)));
    }

    return cb.lessThan(procedure.get(closedAt), getArchivingPeriodInstantSelectCase(procedure, cb));
  }

  private SimpleCase<ProcedureType, Instant> getArchivingPeriodInstantSelectCase(
      Root<ProcedureT> procedure, CriteriaBuilder cb) {
    SimpleCase<ProcedureType, Instant> archivingPeriodInstantSelectCase =
        cb.selectCase(procedure.get(procedureType));

    for (Entry<ProcedureType, Details> entry : archivingProperties.details().entrySet()) {
      ProcedureType procedureType = entry.getKey();
      Period archivingPeriod = entry.getValue().years();

      archivingPeriodInstantSelectCase.when(
          cb.literal(procedureType), cb.literal(getArchivingPeriodInstant(archivingPeriod)));
    }

    archivingPeriodInstantSelectCase.otherwise(
        cb.literal(getArchivingPeriodInstant(DEFAULT_ARCHIVING_PERIOD)));

    return archivingPeriodInstantSelectCase;
  }

  public Specification<ProcedureT> procedureHasArchivingRelevanceDefault() {
    return (root, query, cb) ->
        cb.equal(root.get(archivingRelevance), cb.literal(ArchivingRelevance.DEFAULT));
  }

  public Instant getArchivingPeriodInstant(Period archivingPeriod) {
    return ZonedDateTime.now(clock)
        .withDayOfYear(1)
        .truncatedTo(DAYS)
        .minus(archivingPeriod)
        .toInstant();
  }
}

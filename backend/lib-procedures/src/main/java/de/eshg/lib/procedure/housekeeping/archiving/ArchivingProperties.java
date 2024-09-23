/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.housekeeping.archiving;

import de.eshg.lib.procedure.domain.model.ArchivingRelevance;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import jakarta.validation.constraints.NotNull;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.boot.convert.PeriodUnit;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(
    value = "de.eshg.lib.procedure.housekeeping.archiving",
    ignoreUnknownFields = false)
public record ArchivingProperties(
    @DefaultValue Map<ProcedureType, Details> details,
    ArchivingGracePeriod gracePeriod,
    String schedule) {

  public static final Period DEFAULT_ARCHIVING_PERIOD = Period.ofYears(10);
  private static final ArchivingRelevance FALLBACK_ARCHIVING_RELEVANCE_ON_MISSING_DEFAULT =
      ArchivingRelevance.IRRELEVANT;

  public ArchivingProperties {
    if (schedule != null
        && !Scheduled.CRON_DISABLED.equals(schedule)
        && !CronExpression.isValidExpression(schedule)) {
      throw new IllegalArgumentException(
          "invalid cron expression used for property archiving schedule: %s".formatted(schedule));
    }
  }

  public ArchivingRelevance getDefaultArchivingRelevanceOrElseFallback(
      ProcedureType procedureType) {
    return Optional.ofNullable(details())
        .map(details -> details.get(procedureType))
        .map(Details::relevance)
        .orElse(FALLBACK_ARCHIVING_RELEVANCE_ON_MISSING_DEFAULT);
  }

  public Period getDefaultArchivingPeriodOrElseDefault(ProcedureType procedureType) {
    return Optional.ofNullable(details())
        .map(details -> details.get(procedureType))
        .map(Details::years)
        .orElse(ArchivingProperties.DEFAULT_ARCHIVING_PERIOD);
  }

  public Set<ProcedureType> getProcedureTypesOrElseEmpty(
      Set<ArchivingRelevance> archivingRelevance) {
    return Arrays.stream(ProcedureType.values())
        .filter(
            type -> archivingRelevance.contains(getDefaultArchivingRelevanceOrElseFallback(type)))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  public int getGracePeriodMonths() {
    return gracePeriod().months().getMonths();
  }

  public record Details(ArchivingRelevance relevance, @PeriodUnit(ChronoUnit.YEARS) Period years) {}

  public record ArchivingGracePeriod(@NotNull @PeriodUnit(ChronoUnit.MONTHS) Period months) {}
}

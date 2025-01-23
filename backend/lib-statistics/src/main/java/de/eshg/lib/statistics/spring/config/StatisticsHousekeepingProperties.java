/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.spring.config;

import jakarta.validation.constraints.NotNull;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.PeriodUnit;

@ConfigurationProperties(value = "de.eshg.statistics.housekeeping")
public class StatisticsHousekeepingProperties {

  @NotNull
  @PeriodUnit(ChronoUnit.DAYS)
  private Period procedureReferencesMaxAgeDays = Period.ofDays(365 * 3 + 1);

  public Period getProcedureReferencesMaxAgeDays() {
    return procedureReferencesMaxAgeDays;
  }

  public void setProcedureReferencesMaxAgeDays(Period procedureReferencesMaxAgeDays) {
    this.procedureReferencesMaxAgeDays = procedureReferencesMaxAgeDays;
  }
}

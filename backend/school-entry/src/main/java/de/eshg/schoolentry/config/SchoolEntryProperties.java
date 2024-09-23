/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.MonthDay;
import java.time.Period;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.schoolentry")
public record SchoolEntryProperties(
    @NotNull Period bulkCreateAppointmentsMinLeadTime,
    @NotNull @Valid Citizens citizens,
    @NotNull MonthDay maxDateOfBirthForRegularSchoolEntry,
    boolean maxDateOfBirthForRegularSchoolEntryIsInclusive) {

  public record Citizens(
      @NotNull Period freeAppointmentsMinLeadTime, @NotNull Period freeAppointmentsMaxLeadTime) {}
}

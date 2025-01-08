/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.clock;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.time.Period;

public record TestHelperClockWindForwardRequest(
    @NotNull @Min(0) int months,
    @NotNull @Min(0) int weeks,
    @NotNull @Min(0) int days,
    @NotNull @Min(0) int hours,
    @NotNull @Min(0) int minutes,
    @NotNull @Min(0) int seconds) {

  public Period toPeriod() {
    return Period.ofMonths(months()).plus(Period.ofWeeks(weeks())).plus(Period.ofDays(days()));
  }

  public Duration toDuration() {
    return Duration.ofHours(hours())
        .plus(Duration.ofMinutes(minutes()))
        .plus(Duration.ofSeconds(seconds()));
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.validation.constraints;

import jakarta.validation.ClockProvider;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Period;

public class DateOfBirthValidator implements ConstraintValidator<DateOfBirth, LocalDate> {

  private Period minAge;
  private Period maxAge;

  @Override
  public void initialize(DateOfBirth dateOfBirthAnnotation) {
    minAge = Period.ofYears(dateOfBirthAnnotation.minAgeInclusive());
    maxAge = Period.ofYears(dateOfBirthAnnotation.maxAgeInclusive());
  }

  @Override
  public boolean isValid(LocalDate date, ConstraintValidatorContext context) {
    if (date == null) {
      return true;
    }
    ClockProvider clockProvider = context.getClockProvider();
    Clock clock = clockProvider.getClock();
    LocalDate today = LocalDate.now(clock);
    LocalDate latestAllowedDate = today.minus(minAge);
    LocalDate earliestAllowedDate = today.minus(maxAge);
    return !latestAllowedDate.isBefore(date) && !date.isBefore(earliestAllowedDate);
  }
}

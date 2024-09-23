/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.validation;

import jakarta.validation.ClockProvider;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Period;

public class AdultValidator implements ConstraintValidator<Adult, LocalDate> {

  private int ageOfMaturityInYears;

  @Override
  public void initialize(Adult constraintAnnotation) {
    this.ageOfMaturityInYears = constraintAnnotation.ageOfMaturityInYears();
  }

  @Override
  public boolean isValid(LocalDate value, ConstraintValidatorContext context) {
    if (value == null) {
      return true;
    }
    ClockProvider clockProvider = context.getClockProvider();
    Clock clock = clockProvider.getClock();
    return Period.between(value, LocalDate.now(clock)).getYears() >= ageOfMaturityInYears;
  }
}

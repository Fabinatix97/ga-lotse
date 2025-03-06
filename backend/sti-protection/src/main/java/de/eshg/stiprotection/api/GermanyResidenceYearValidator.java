/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.Year;

public class GermanyResidenceYearValidator
    implements ConstraintValidator<ValidGermanyResidenceYear, PersonalDetails> {

  private String message;

  @Override
  public void initialize(ValidGermanyResidenceYear constraintAnnotation) {
    message = constraintAnnotation.message();
  }

  @Override
  public boolean isValid(PersonalDetails details, ConstraintValidatorContext context) {
    if (details == null || details.inGermanySince() == null) {
      return true;
    }
    Year yearOfBirth = details.yearOfBirth();
    Year inGermanySince = details.inGermanySince();

    boolean valid = yearOfBirth.equals(inGermanySince) || yearOfBirth.isBefore(inGermanySince);
    if (!valid) {
      context.disableDefaultConstraintViolation();
      context
          .buildConstraintViolationWithTemplate(message)
          .addPropertyNode("inGermanySince")
          .addConstraintViolation();
    }
    return valid;
  }
}

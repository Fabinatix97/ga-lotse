/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.List;

public class DiseaseTypeSubSetValidator implements ConstraintValidator<DiseaseTypes, DiseaseType> {
  private DiseaseType[] diseaseTypes;

  @Override
  public void initialize(DiseaseTypes constraint) {
    this.diseaseTypes = constraint.value();
  }

  @Override
  public boolean isValid(DiseaseType value, ConstraintValidatorContext context) {
    if (value == null) {
      return true;
    }
    return List.of(this.diseaseTypes).contains(value);
  }
}

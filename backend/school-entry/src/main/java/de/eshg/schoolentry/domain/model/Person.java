/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PSEUDONYMIZED;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.util.Objects;

@Entity
@DataSensitivity(PSEUDONYMIZED)
@Table(indexes = @Index(columnList = "procedure_id"))
public class Person extends RelatedPerson<SchoolEntryProcedure> {

  boolean isChild() {
    return hasPersonType(PersonType.PATIENT);
  }

  boolean isCustodian() {
    return hasPersonType(PersonType.PARENT);
  }

  private boolean hasPersonType(PersonType personType) {
    return Objects.equals(personType, getPersonType());
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import java.util.Objects;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(indexes = @Index(columnList = "procedure_id"))
public abstract class Person extends RelatedPerson<MedicalRegistryProcedure> {

  protected Person() {}

  protected Person(PersonType personType) {
    super(personType);
  }

  @Override
  public void setPersonType(PersonType personType) {
    throw new IllegalArgumentException("Person type cannot be modified");
  }

  public boolean hasPersonType(PersonType personType) {
    return Objects.equals(personType, getPersonType());
  }
}

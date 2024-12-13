/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.eshg.lib.procedure.domain.model.Procedure;
import jakarta.persistence.Entity;

@Entity
public class OmsProcedure extends Procedure<OmsProcedure, OmsTask, Person, Facility> {

  public Person findAffectedPerson() {
    if (getRelatedPersons().isEmpty()) {
      return null;
    }
    return getRelatedPersons().getFirst();
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.procedure.domain.model.Procedure;
import jakarta.persistence.Entity;
import jakarta.persistence.Transient;
import java.util.Optional;

@Entity
public class OmsProcedure extends Procedure<OmsProcedure, OmsTask, Person, Facility> {

  public Person findAffectedPerson() {
    if (getRelatedPersons().isEmpty()) {
      return null;
    }
    return getRelatedPersons().getFirst();
  }

  @Transient
  public Optional<Facility> getFacility() {
    return getRelatedFacilities().stream().collect(StreamUtil.toSingleOptionalElement());
  }
}

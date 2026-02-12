/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import de.eshg.infectionbriefing.domain.model.InfectionBriefingPerson;
import de.eshg.lib.procedure.domain.model.PersonType;
import java.util.UUID;

public class InfectionBriefingPersonMapper {
  private InfectionBriefingPersonMapper() {}

  public static InfectionBriefingPerson mapToInfectionBriefingPerson(UUID fileStateId) {
    InfectionBriefingPerson person = new InfectionBriefingPerson();
    person.setCentralFileStateId(fileStateId);
    person.setPersonType(PersonType.PROFESSIONAL);
    return person;
  }
}

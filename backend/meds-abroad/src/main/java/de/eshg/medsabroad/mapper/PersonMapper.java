/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.mapper;

import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.medsabroad.api.PersonDto;

public class PersonMapper {

  private PersonMapper() {}

  public static PersonDto toInterfaceType(GetPersonFileStateResponse person) {
    return new PersonDto(person.firstName(), person.lastName(), person.dateOfBirth());
  }

  public static AddPersonFileStateRequest toApiType(PersonDto person) {
    return new AddPersonFileStateRequest(
        null,
        null,
        null,
        null,
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        DataOriginDto.MANUAL);
  }
}

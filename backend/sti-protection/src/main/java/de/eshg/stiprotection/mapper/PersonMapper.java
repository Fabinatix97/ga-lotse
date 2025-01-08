/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.stiprotection.api.PersonDto;
import de.eshg.stiprotection.persistence.db.Person;

public class PersonMapper {

  private PersonMapper() {}

  public static PersonDto toInterfaceType(Person person, String accessCode) {
    return new PersonDto(
        person.getExternalId(),
        GenderMapper.toInterfaceType(person.getGender()),
        person.getYearOfBirth(),
        person.getCountryOfBirth(),
        person.getInGermanySince(),
        accessCode);
  }
}

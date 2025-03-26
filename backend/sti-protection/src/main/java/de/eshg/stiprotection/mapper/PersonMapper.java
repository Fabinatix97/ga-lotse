/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.lib.appointmentblock.MappingUtil;
import de.eshg.stiprotection.api.ConcernDto;
import de.eshg.stiprotection.api.PersonDto;
import de.eshg.stiprotection.api.PersonalDetails;
import de.eshg.stiprotection.api.UpdatePersonDetailsRequest;
import de.eshg.stiprotection.api.citizen.AddPersonalDetailsResponse;
import de.eshg.stiprotection.persistence.data.PersonData;
import de.eshg.stiprotection.persistence.db.Person;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import java.time.Instant;
import java.time.Year;

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

  public static PersonData toDataType(PersonalDetails request) {
    return new PersonData(
        GenderMapper.toDatabaseType(request.gender()),
        request.yearOfBirth(),
        request.countryOfBirth(),
        request.inGermanySince());
  }

  public static PersonData toDataType(UpdatePersonDetailsRequest request) {
    return new PersonData(
        GenderMapper.toDatabaseType(request.gender()),
        request.yearOfBirth(),
        request.countryOfBirth(),
        request.inGermanySince());
  }

  public static PersonData toDataType(Person entity) {
    return new PersonData(
        entity.getGender(),
        entity.getYearOfBirth(),
        entity.getCountryOfBirth(),
        entity.getInGermanySince());
  }

  public static Person toDatabaseType(PersonData data) {
    Person person = new Person();
    person.setGender(data.gender());
    person.setYearOfBirth(data.yearOfBirth());
    person.setCountryOfBirth(data.countryOfBirth());
    person.setInGermanySince(data.inGermanySince());
    return person;
  }

  public static AddPersonalDetailsResponse toInterfaceType(StiProtectionProcedure procedure) {
    ConcernDto concern = MappingUtil.mapEnum(ConcernDto.class, procedure.getConcern());
    Instant appointmentStart = procedure.getAppointmentStart();
    Year yearOfBirth = procedure.getPerson().getYearOfBirth();
    return new AddPersonalDetailsResponse(
        concern, appointmentStart, yearOfBirth, procedure.getExternalId());
  }
}

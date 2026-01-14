/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.FacilityContactPersonDto;
import java.util.List;

public class FacilityContactPersonMapper {

  private FacilityContactPersonMapper() {}

  public static List<FacilityContactPersonDto> map(
      List<de.eshg.base.centralfile.api.facility.FacilityContactPersonDto> contactPersons) {
    return contactPersons.stream()
        .map(
            contactPerson ->
                new FacilityContactPersonDto(
                    contactPerson.firstName(),
                    contactPerson.lastName(),
                    contactPerson.phoneNumber(),
                    contactPerson.emailAddress(),
                    contactPerson.role(),
                    contactPerson.salutation(),
                    contactPerson.title()))
        .toList();
  }
}

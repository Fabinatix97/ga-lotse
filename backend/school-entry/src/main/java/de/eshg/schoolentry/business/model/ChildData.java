/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.base.GenderDto;
import de.eshg.base.address.AddressDto;
import de.eshg.lib.common.CountryCode;
import java.time.LocalDate;
import java.util.List;

public record ChildData(
    String firstName,
    String lastName,
    LocalDate dateOfBirth,
    String placeOfBirth,
    CountryCode countryOfBirth,
    GenderDto gender,
    AddressDto address,
    List<String> phoneNumbers) {

  public ChildData(
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      String placeOfBirth,
      CountryCode countryOfBirth,
      GenderDto gender,
      AddressDto address) {
    this(firstName, lastName, dateOfBirth, placeOfBirth, countryOfBirth, gender, address, null);
  }
}

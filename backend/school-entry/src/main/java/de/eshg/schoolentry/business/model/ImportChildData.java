/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.base.CountryCodeDto;
import de.eshg.base.GenderDto;
import java.time.LocalDate;

public record ImportChildData(
    String firstName,
    String lastName,
    LocalDate dateOfBirth,
    String placeOfBirth,
    CountryCodeDto countryOfBirth,
    GenderDto gender,
    AddressData address,
    String phoneNumber) {
  public ImportChildData(
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      GenderDto gender,
      AddressData address,
      String phoneNumber) {
    this(firstName, lastName, dateOfBirth, null, null, gender, address, phoneNumber);
  }

  public ImportChildData(
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      String placeOfBirth,
      CountryCodeDto countryOfBirth,
      GenderDto gender,
      AddressData address) {
    this(firstName, lastName, dateOfBirth, placeOfBirth, countryOfBirth, gender, address, null);
  }
}

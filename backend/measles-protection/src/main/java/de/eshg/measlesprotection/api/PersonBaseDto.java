/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;

public interface PersonBaseDto {

  int AGE_OF_MATURITY_IN_YEARS = 18;

  String firstName();

  String lastName();

  LocalDate dateOfBirth();

  List<@NotBlank String> phoneNumbers();

  List<@Email String> emailAddresses();

  GenderDto gender();

  SalutationDto salutation();

  String title();

  AddressDto address();

  @JsonIgnore
  default boolean isAdult() {
    return Period.between(dateOfBirth(), LocalDate.now()).getYears() >= AGE_OF_MATURITY_IN_YEARS;
  }
}

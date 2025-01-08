/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;

public interface PersonDetails {
  @Schema(description = "The academic title of a Person.", example = "Prof. Dr.")
  String title();

  SalutationDto salutation();

  GenderDto gender();

  @Schema(description = "The given name(s) of the Person.", example = "John")
  String firstName();

  @Schema(description = "The last name of the Person.", example = "Doe")
  String lastName();

  @Schema(description = "The date of birth of the Person.", example = "2000-01-01")
  LocalDate dateOfBirth();

  @Schema(description = "The last name at birth of the Person.", example = "Smith")
  String nameAtBirth();

  @Schema(description = "The place of birth (without country) of the Person.", example = "Berlin")
  String placeOfBirth();

  CountryCode countryOfBirth();

  @ArraySchema(
      arraySchema =
          @Schema(
              description = "A list of email addresses of the Person.",
              example = "['mail1@address.de','mail2@address.de','mail3@address.de']"))
  List<String> emailAddresses();

  @ArraySchema(
      arraySchema =
          @Schema(
              description = "A list of telephone numbers of the Person.",
              example = "['+4912345678901','+4912345678902','+4912345678903']"))
  List<String> phoneNumbers();

  AddressDto contactAddress();

  AddressDto differentBillingAddress();
}

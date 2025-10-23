/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = "CreatePersonWithoutDateOfBirth")
public record CreatePersonWithoutDateOfBirthDto(
    @Size(min = 1, max = 119) String title,
    SchoolEntrySalutationDto salutation,
    SchoolEntryGenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid SchoolEntryAddressDto contactAddress) {

  public CreatePersonWithoutDateOfBirthDto(String firstName, String lastName) {
    this(null, null, null, firstName, lastName, null, null, null);
  }
}

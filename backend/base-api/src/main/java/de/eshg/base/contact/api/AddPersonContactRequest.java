/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record AddPersonContactRequest(
    @Schema(description = "The academic title of a Person.", example = "Prof. Dr.")
        @Size(min = 1, max = 119)
        String title,
    @Schema(description = "The given name(s) of the Person.", example = "John")
        @Size(min = 1, max = 80)
        String firstName,
    @Schema(description = "The last name of the Person.", example = "Doe")
        @NotNull
        @Size(min = 1, max = 120)
        String name,
    SalutationDto salutation,
    GenderDto gender,
    @Schema(
            description = "The chat username of the gematik TI-Messenger (matrix chat).",
            example = "@username:server")
        @Size(min = 1, max = 255)
        String externalChatUsername,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress)
    implements AbstractAddContactRequest {
  public static final String SCHEMA_NAME = "AddPersonContactRequest";

  public AddPersonContactRequest(String name) {
    this(null, null, name, null, null, null, null, null, null, null);
  }

  public AddPersonContactRequest(String name, String firstName) {
    this(null, firstName, name, null, null, null, null, null, null, null);
  }

  public AddPersonContactRequest(String name, AddressDto address) {
    this(null, null, name, null, null, null, null, null, address, null);
  }

  public AddPersonContactRequest(String name, String firstName, AddressDto address) {
    this(null, firstName, name, null, null, null, null, null, address, null);
  }
}

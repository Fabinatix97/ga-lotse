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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = PersonContactDto.SCHEMA_NAME)
public record PersonContactDto(
    @NotNull UUID id,
    UUID mergedIntoId,
    @Schema(description = "The academic title of a Person.", example = "Prof. Dr.") String title,
    @Schema(description = "The given name(s) of the Person.", example = "John") String firstName,
    @Schema(description = "The last name of the Person.", example = "Doe") @NotBlank String name,
    SalutationDto salutation,
    GenderDto gender,
    @Schema(
            description = "The chat username of the gematik TI-Messenger (matrix chat).",
            example = "@username:server")
        String externalChatUsername,
    @NotNull List<String> phoneNumbers,
    @NotNull List<String> emailAddresses,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress)
    implements ContactDto {

  public static final String SCHEMA_NAME = "PersonContact";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}

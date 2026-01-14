/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.base.address.AddressDto;
import de.eshg.validation.constraints.MandatoryEmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record UpdateInstitutionContactRequest(
    @Schema(
            description = "The Id of another Contact which shall be merged into this one.",
            example = "ce9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        UUID mergedFrom,
    @Schema(description = "The name of the Institution.", example = "123 Example Laboratory")
        @NotNull
        @Size(min = 1, max = 300)
        String name,
    InstitutionContactCategoryDto category,
    InstitutionContactSubCategoryDto subCategory,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description = "A list of telephone numbers of the Contact.",
                    example = "['+4912345678901','+4912345678902','+4912345678903']"))
        List<@Size(min = 1, max = 23) String> phoneNumbers,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description = "A list of email addresses of the Contact.",
                    example = "['mail1@address.de','mail2@address.de','mail3@address.de']"))
        List<@MandatoryEmailAddressConstraint String> emailAddresses,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress)
    implements AbstractUpdateContactRequest {
  public static final String SCHEMA_NAME = "UpdateInstitutionContactRequest";

  public UpdateInstitutionContactRequest(
      @NotBlank String name,
      InstitutionContactCategoryDto category,
      List<String> phoneNumbers,
      List<String> emailAddresses,
      @Valid AddressDto contactAddress,
      @Valid AddressDto differentBillingAddress) {
    this(
        null,
        name,
        category,
        null,
        phoneNumbers,
        emailAddresses,
        contactAddress,
        differentBillingAddress);
  }
}

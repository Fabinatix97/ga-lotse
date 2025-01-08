/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.CustomValidations.MandatoryEmailAddressConstraint;
import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = InstitutionContactDto.SCHEMA_NAME)
public record InstitutionContactDto(
    @NotNull UUID id,
    UUID mergedIntoId,
    @Schema(description = "The name of the Institution.", example = "123 Example Laboratory")
        @NotBlank
        String name,
    InstitutionContactCategoryDto category,
    @NotNull List<String> phoneNumbers,
    @NotNull List<@MandatoryEmailAddressConstraint String> emailAddresses,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress)
    implements ContactDto {
  public static final String SCHEMA_NAME = "InstitutionContact";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}

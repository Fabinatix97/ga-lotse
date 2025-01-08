/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.CustomValidations.MandatoryEmailAddressConstraint;
import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record AddInstitutionContactRequest(
    @Schema(description = "The name of the Institution.", example = "123 Example Laboratory")
        @NotNull
        @Size(min = 1, max = 300)
        String name,
    InstitutionContactCategoryDto category,
    List<@Size(min = 1, max = 23) String> phoneNumbers,
    List<@MandatoryEmailAddressConstraint String> emailAddresses,
    @Valid @NotNull AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress)
    implements AbstractAddContactRequest {
  public static final String SCHEMA_NAME = "AddInstitutionContactRequest";

  public AddInstitutionContactRequest(String name, AddressDto contactAddress) {
    this(name, null, null, null, contactAddress, null);
  }

  public AddInstitutionContactRequest(
      String name, List<String> emailAddresses, AddressDto contactAddress) {
    this(name, null, null, emailAddresses, contactAddress, null);
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.draft;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Schema(
    name = "CustodianWithoutDateOfBirthDetails",
    description =
        "Related to the affected person and required if the affected person is a minor and no date of birth is known.")
public record CustodianWithoutDateOfBirthDetailsDto(
    @NotBlank @Schema(description = "First name of the custodian.", example = "Mike")
        String firstName,
    @NotBlank @Schema(description = "Last name of the custodian.", example = "Himmel")
        String lastName,
    List<@NotBlank String> phoneNumbers,
    List<@Email String> emailAddresses,
    GenderDto gender,
    SalutationDto salutation,
    String title,
    @Valid AddressDto address) {}

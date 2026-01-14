/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.draft;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Schema(
    name = "AffectedPersonDetails",
    description =
        "Represents the individual the facility reports on and is the integral part of the procedure.")
public record AffectedPersonDetailsDto(
    @NotBlank @Schema(description = "First name of the affected person.", example = "Susanne")
        String firstName,
    @NotBlank @Schema(description = "Last name of the affected person.", example = "Gerber")
        String lastName,
    @NotNull @Schema(description = "Date of birth of the affected person.", example = "2018-07-26")
        LocalDate dateOfBirth,
    List<@NotBlank String> phoneNumbers,
    List<@Email String> emailAddresses,
    CountryCode countryOfBirth,
    GenderDto gender,
    String nameAtBirth,
    String placeOfBirth,
    SalutationDto salutation,
    String title,
    @Valid AddressDto address,
    @Valid AddressDto differentBillingAddress,
    @Valid List<CustodianDetailsDto> custodians) {}

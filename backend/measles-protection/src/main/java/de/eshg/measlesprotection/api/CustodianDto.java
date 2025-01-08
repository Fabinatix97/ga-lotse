/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.measlesprotection.validation.Adult;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(
    name = "Custodian",
    description = "Related to the affected person and required if the affected person is a minor.")
public record CustodianDto(
    @NotNull UUID custodianId,
    @NotBlank @Schema(description = "First name of the custodian.", example = "Mike")
        String firstName,
    @NotBlank @Schema(description = "Last name of the custodian.", example = "Himmel")
        String lastName,
    @NotNull
        @Adult(message = "Custodian must be an adult")
        @Schema(description = "Date of birth of the custodian.", example = "1951-02-16")
        LocalDate dateOfBirth,
    List<@NotBlank String> phoneNumbers,
    List<@Email String> emailAddresses,
    GenderDto gender,
    SalutationDto salutation,
    String title,
    @NotNull @Valid AddressDto address)
    implements PersonBaseDto {}

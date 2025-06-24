/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

@Schema(name = "Patient")
public record PatientDto(
    SalutationDto salutation,
    @NotBlank @Size(max = 80) String firstName,
    @NotBlank @Size(max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    List<@Email String> emailAddresses,
    List<@NotBlank @Size(min = 1, max = 23) String> phoneNumbers,
    CountryCode countryOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @Size(min = 1, max = 50) String placeOfBirth,
    @Size(min = 1, max = 119) String title,
    GenderDto gender,
    @Valid PersonAddressDto address,
    @Valid PersonAddressDto differentBillingAddress) {}

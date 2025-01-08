/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.CustomValidations.MandatoryEmailAddressConstraint;
import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

@Schema(name = "Applicant")
public record ApplicantDto(
    @Size(min = 1, max = 119) String title,
    @NotNull GenderDto gender,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull LocalDate dateOfBirth,
    @Size(min = 1, max = 40) String nameAtBirth,
    @NotNull @Size(min = 1, max = 50) String placeOfBirth,
    @NotNull List<@MandatoryEmailAddressConstraint String> emailAddresses,
    @NotEmpty List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @NotNull @Valid ApplicantAddressDto address,
    @NotNull CountryCode nationality) {}

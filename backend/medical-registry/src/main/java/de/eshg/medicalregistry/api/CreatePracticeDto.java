/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.CustomValidations.EmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(name = "CreatePractice")
public record CreatePracticeDto(
    @NotNull @Size(min = 1, max = 300) String name,
    @NotNull @EmailAddressConstraint String emailAddress,
    @NotNull @Size(min = 1, max = 23) String phoneNumber,
    @NotNull @Valid PracticeAddressDto address,
    @Size(min = 6, max = 254) String website,
    @Pattern(regexp = "\\d+") String institutionIdentifier,
    @Pattern(regexp = "\\d+") String establishmentNumber,
    @NotNull boolean healthInsuranceAuthorization,
    String openingHours) {
  public CreatePracticeDto(
      String name,
      String emailAddress,
      String phoneNumber,
      PracticeAddressDto address,
      boolean healthInsuranceAuthorization) {
    this(
        name,
        emailAddress,
        phoneNumber,
        address,
        null,
        null,
        null,
        healthInsuranceAuthorization,
        null);
  }
}

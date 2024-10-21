/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "Practice")
public record PracticeDto(
    @NotNull @Size(min = 1, max = 300) String name,
    @Size(min = 6, max = 254) String emailAddress,
    @Size(min = 1, max = 23) String phoneNumber,
    @Valid AddressDto address,
    @Size(min = 6, max = 254) String website,
    String institutionIdentifier,
    String establishmentNumber,
    @NotNull boolean healthInsuranceAuthorization,
    String openingHours) {
  public PracticeDto(String name, boolean healthInsuranceAuthorization) {
    this(name, null, null, null, null, null, null, healthInsuranceAuthorization, null);
  }
}

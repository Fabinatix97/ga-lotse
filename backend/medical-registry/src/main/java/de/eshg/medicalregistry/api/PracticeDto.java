/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.validation.constraints.MandatoryEmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = "Practice")
public record PracticeDto(
    @NotNull @Size(min = 1, max = 300) String name,
    @NotNull List<@MandatoryEmailAddressConstraint String> emailAddresses,
    @NotEmpty List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @NotNull @Valid PracticeAddressDto address,
    @Size(min = 6, max = 254) String website,
    @Pattern(regexp = "\\d+") String institutionIdentifier,
    @Pattern(regexp = "\\d+") String establishmentNumber,
    @NotNull boolean healthInsuranceAuthorization,
    String openingHours) {}

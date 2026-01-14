/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.lib.common.CountryCode;
import de.eshg.validation.constraints.DateOfBirth;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record UpdateEncryptedPersonalDataRequest(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull @DateOfBirth(minAgeInclusive = 18) LocalDate dateOfBirth,
    String alias,
    CountryCode nationality,
    DocumentTypeDto documentType,
    List<LanguageDto> languages) {}

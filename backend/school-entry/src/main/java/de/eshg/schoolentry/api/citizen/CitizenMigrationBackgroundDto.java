/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.citizen;

import de.eshg.schoolentry.api.CountryCodeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(name = "CitizenMigrationBackground")
public record CitizenMigrationBackgroundDto(
    @Schema(description = "Nationality of the child", example = "DEU")
        CountryCodeDto nationalityChild,
    @Schema(description = "Country of birth of the child", example = "DEU")
        CountryCodeDto countryOfBirthChild,
    @Schema(description = "Nationality of the first parent", example = "DEU")
        CountryCodeDto nationalityFirstParent,
    @Schema(description = "Country of birth of the first parent", example = "DEU")
        CountryCodeDto countryOfBirthFirstParent,
    @Schema(description = "Nationality of the second parent", example = "DEU")
        CountryCodeDto nationalitySecondParent,
    @Schema(description = "Country of birth of the second parent", example = "DEU")
        CountryCodeDto countryOfBirthSecondParent,
    @Schema(description = "Date from which the child lives in Germany", example = "2000-01-01")
        LocalDate inGermanySince) {}

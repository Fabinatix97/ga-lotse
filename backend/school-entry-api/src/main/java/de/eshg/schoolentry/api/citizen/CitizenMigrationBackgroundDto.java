/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.citizen;

import de.eshg.schoolentry.api.CountryCodeDto;
import io.swagger.v3.oas.annotations.media.Schema;

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
        CountryCodeDto countryOfBirthSecondParent) {
  public CitizenMigrationBackgroundDto() {
    this(null, null, null, null, null, null);
  }
}

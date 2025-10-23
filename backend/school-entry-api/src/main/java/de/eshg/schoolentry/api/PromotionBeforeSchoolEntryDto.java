/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = " PromotionBeforeSchoolEntry")
public record PromotionBeforeSchoolEntryDto(
    @Schema(description = "Boolean that indicates, if the child participated in early support.")
        Boolean earlySupport,
    @Schema(description = "Boolean that indicates, if the child has an integration place")
        Boolean integrationPlace,
    @Schema(
            description =
                "Boolean that indicates, if the child participated in occupational therapy.")
        Boolean ergotherapy,
    @Schema(description = "Boolean that indicates, if the child participated in speech therapy.")
        Boolean speechTherapy,
    @Schema(description = "Boolean that indicates, if the child participated in physio therapy.")
        Boolean physiotherapy) {
  public PromotionBeforeSchoolEntryDto() {
    this(null, null, null, null, null);
  }
}

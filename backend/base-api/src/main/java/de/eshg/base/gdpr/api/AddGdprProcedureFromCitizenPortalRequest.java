/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request used for initiating GDPR procedures from the citizen portal")
public record AddGdprProcedureFromCitizenPortalRequest(
    @NotNull GdprProcedureTypeDto type,
    @Schema(
            description =
                "The matter of concern for the GDPR procedure (relevant only for the right to rectification and right to object")
        String matterOfConcern) {

  public AddGdprProcedureFromCitizenPortalRequest(GdprProcedureTypeDto type) {
    this(type, null);
  }
}

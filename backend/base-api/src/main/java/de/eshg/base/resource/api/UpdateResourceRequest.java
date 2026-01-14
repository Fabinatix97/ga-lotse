/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource.api;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record UpdateResourceRequest(
    @Schema(description = "The name of the Resource.", example = "White delivery truck") @NotBlank
        String name,
    @Schema(
            description = "Free text field for descriptive information on the Resource.",
            example = "The car is parked in the right garage.")
        String description,
    @Schema(
            description = "A descriptive number of the Resource, e.g. the article or model number.",
            example = "T-800")
        String articleNumber,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "A list of label names. Any provided name will be used to resolve existing labels from the database.",
                    example = "['Label1','Label2','Label3']"))
        List<String> labelNames) {

  public UpdateResourceRequest(String name) {
    this(name, null, null, null);
  }
}

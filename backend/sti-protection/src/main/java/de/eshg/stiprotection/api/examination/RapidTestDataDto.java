/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(
    name = "RapidTestData",
    description = "Used in the context of rapid test examinations to document test results.")
public record RapidTestDataDto(
    @Schema(
            description =
                "Represents the test number, which can be numerical, alphanumerical or alphabetical.",
            example = "Test-481516")
        String number,
    @Schema(description = "Indicates the outcome of the rapid test result") @NotNull
        Boolean result) {}

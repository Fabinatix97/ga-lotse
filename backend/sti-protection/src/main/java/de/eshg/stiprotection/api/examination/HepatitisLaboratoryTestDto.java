/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "HepatitisLaboratoryTest",
    description =
        "Used in the context of laboratory test examination to document test results for Hepatitis A and Hepatitis B.")
public record HepatitisLaboratoryTestDto(
    @Schema(description = "Indicates the outcome of the laboratory test result.") Boolean result,
    @Schema(description = "Indicates whether the test is conducted in the context of an infection.")
        Boolean infection,
    @Schema(
            description =
                "Indicates whether the test is conducted in the context of a vaccination.")
        Boolean vaccineTitre,
    @Schema(
            description =
                "Records a specific measurement or value obtained from the laboratory test results.",
            example = "1.5 U/ml")
        String value,
    @Schema(
            description = "Provides additional comments related to the corresponding test.",
            example = "HAV-AK IgM-Test")
        String remark) {}

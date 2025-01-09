/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "LaboratoryTest",
    description = "Used in the context of laboratory test examinations to document test results.")
public record LaboratoryTestDto(
    @Schema(description = "Indicates the outcome of the laboratory test result.") Boolean result,
    @Schema(
            description =
                "Records a specific measurement or value obtained from the laboratory test results.",
            example = "Chlamydia tr. rRNA Test")
        String value,
    @Schema(
            description = "Provides additional comments related to the corresponding test.",
            example = "CT-Value: 28.5")
        String remark) {}

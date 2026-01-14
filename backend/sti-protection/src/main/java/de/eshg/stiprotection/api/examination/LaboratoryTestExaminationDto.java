/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import de.eshg.stiprotection.api.examination.labtests.LabTestDataDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.List;

@Schema(
    name = "LaboratoryTestExamination",
    description =
        "Used to document the initial request which laboratory tests should be performed and to record the corresponding results.")
public record LaboratoryTestExaminationDto(
    @Schema(
            description =
                "Specifies a barcode for tracking the results with the external laboratory.",
            example = "4815162342")
        String sampleBarcode,
    @Schema(
            description = "Provides general comments related to the laboratory tests.",
            example = "Sample processed at Black Mesa Diagnostics Laboratory.")
        String generalRemarks,
    @Schema(
            description =
                "Indicates if the tests were conducted and is used for the laboratory status.")
        Boolean testsConducted,
    @Schema(description = "Indicates whether the patient has paid for the tests.")
        Boolean testsPayed,
    @Valid List<LabTestDataDto> labTestData) {}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

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
    @Schema(description = "Specifies whether an HIV laboratory test is requested.")
        Boolean hivTestRequested,
    @Schema(description = "Specifies whether a Syphilis laboratory test is requested.")
        Boolean syphilisTestRequested,
    @Schema(description = "Specifies whether a Hepatitis A laboratory test is requested.")
        Boolean hepATestRequested,
    @Schema(description = "Specifies whether a Hepatitis B laboratory test is requested.")
        Boolean hepBTestRequested,
    @Schema(description = "Specifies whether a Hepatitis C laboratory test is requested.")
        Boolean hepCTestRequested,
    @Schema(description = "Specifies whether a Chlamydia laboratory test is requested.")
        Boolean chlamydiaTestRequested,
    @Schema(description = "Specifies whether a Gonorrhea laboratory test is requested.")
        Boolean gonorrheaTestRequested,
    @Schema(description = "Specifies whether a Mycoplasma laboratory test is requested.")
        Boolean mycoplasmaTestRequested,
    @Schema(description = "Specifies whether a Cancer Screening laboratory test is requested.")
        Boolean cancerScreeningTestRequested,
    @Schema(description = "Specifies whether an HPV laboratory test is requested.")
        Boolean hpvTestRequested,
    @Schema(description = "Specifies whether a Mpox laboratory test is requested.")
        Boolean mpoxTestRequested,
    @Schema(description = "Specifies whether another additional laboratory test is requested.")
        Boolean otherTestRequested,
    @Valid LaboratoryTestDto hivTestData,
    @Valid LaboratoryTestDto syphilisTestData,
    @Schema(description = "Indicates if the patient was previously infected with Syphilis.")
        Boolean hadSyphilis,
    @Valid HepatitisLaboratoryTestDto hepATestData,
    @Valid HepatitisLaboratoryTestDto hepBTestData,
    @Valid LaboratoryTestDto hepCTestData,
    @Valid LaboratoryTestSamplesDto chlamydiaTestSamples,
    @Valid LaboratoryTestSamplesDto gonorrheaTestSamples,
    @Valid LaboratoryTestSamplesDto mycoplasmaTestSamples,
    @Valid LaboratoryTestDto cancerScreeningTestData,
    @Valid LaboratoryTestDto hpvTestData,
    @Valid LaboratoryTestDto mpoxTestData,
    @Schema(
            description = "Records the name of the additional laboratory test.",
            example = "Ethylglucuronid (LC-MS/MS).")
        String otherTestName,
    @Valid LaboratoryTestDto otherTestData) {}

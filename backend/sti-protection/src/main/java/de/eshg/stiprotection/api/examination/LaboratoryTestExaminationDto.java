/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = "LaboratoryTestExamination")
public record LaboratoryTestExaminationDto(
    String sampleBarcode,
    String generalRemarks,
    Boolean testsConducted,
    Boolean testsPayed,
    Boolean hivTestRequested,
    Boolean syphilisTestRequested,
    Boolean hepATestRequested,
    Boolean hepBTestRequested,
    Boolean hepCTestRequested,
    Boolean chlamydiaTestRequested,
    Boolean gonorrheaTestRequested,
    Boolean mycoplasmaTestRequested,
    Boolean cancerScreeningTestRequested,
    Boolean hpvTestRequested,
    Boolean mpoxTestRequested,
    Boolean otherTestRequested,
    @Valid LaboratoryTestDto hivTestData,
    @Valid LaboratoryTestDto syphilisTestData,
    Boolean hadSyphilis,
    @Valid HepatitisLaboratoryTestDto hepATestData,
    @Valid HepatitisLaboratoryTestDto hepBTestData,
    @Valid LaboratoryTestDto hepCTestData,
    @Valid LaboratoryTestSamplesDto chlamydiaTestSamples,
    @Valid LaboratoryTestSamplesDto gonorrhoeaTestSamples,
    @Valid LaboratoryTestSamplesDto mycoplasmaTestSamples,
    @Valid LaboratoryTestDto cancerScreeningTestData,
    @Valid LaboratoryTestDto hpvTestData,
    @Valid LaboratoryTestDto mpoxTestData,
    String otherTestName,
    @Valid LaboratoryTestDto otherTestData) {}

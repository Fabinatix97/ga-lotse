/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PreviousIllness")
public record PreviousIllnessDto(
    @Schema(description = "Indicates if the patient was diagnosed with or experienced Hepatitis A.")
        Boolean hepA,
    @Schema(description = "Indicates if the patient was diagnosed with or experienced Hepatitis B.")
        Boolean hepB,
    @Schema(description = "Indicates if the patient was diagnosed with or experienced Hepatitis C.")
        Boolean hepC,
    @Schema(description = "Indicates if the patient was diagnosed with or experienced HIV.")
        Boolean hiv,
    @Schema(description = "Indicates if the patient was diagnosed with or experienced Syphilis.")
        Boolean syphilis,
    @Schema(description = "Indicates if the patient was diagnosed with or experienced Gonorrhea.")
        Boolean gonorrhea,
    @Schema(description = "Indicates if the patient was diagnosed with or experienced Chlamydia.")
        Boolean chlamydia,
    @Schema(description = "Indicates if the patient was diagnosed with another not listed illness.")
        Boolean other,
    @Schema(description = "Holds additional info regarding the other illness.") String otherData) {}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Schema(name = "Examination")
public record ExaminationDto(
    @Schema(description = "Indicating if the patient has been examined for Hepatitis A.")
        Boolean hepA,
    @Schema(description = "Indicating if the patient has been examined for Hepatitis B.")
        Boolean hepB,
    @Schema(description = "Indicating if the patient has been examined for Hepatitis C.")
        Boolean hepC,
    @Schema(description = "Indicating if the patient has been examined for HIV.") Boolean hiv,
    @Schema(description = "Indicating if the patient has been examined for Syphilis.")
        Boolean syphilis,
    @Schema(description = "Indicating if the patient has been examined for Gonorrhea.")
        Boolean gonorrhea,
    @Schema(description = "Indicating if the patient has been examined for Chlamydia.")
        Boolean chlamydia,
    @PastOrPresent
        @Schema(description = "Date indicating when the patient was last examined for Hepatitis A.")
        LocalDate hepADate,
    @PastOrPresent
        @Schema(description = "Date indicating when the patient was last examined for Hepatitis B.")
        LocalDate hepBDate,
    @PastOrPresent
        @Schema(description = "Date indicating when the patient was last examined for Hepatitis C.")
        LocalDate hepCDate,
    @PastOrPresent
        @Schema(description = "Date indicating when the patient was last examined for HIV.")
        LocalDate hivDate,
    @PastOrPresent
        @Schema(description = "Date indicating when the patient was last examined for Syphilis.")
        LocalDate syphilisDate,
    @PastOrPresent
        @Schema(description = "Date indicating when the patient was last examined for Gonorrhea.")
        LocalDate gonorrheaDate,
    @PastOrPresent
        @Schema(description = "Date indicating when the patient was last examined for Chlamydia.")
        LocalDate chlamydiaDate) {}

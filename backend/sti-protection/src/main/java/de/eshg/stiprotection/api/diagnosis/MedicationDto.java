/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.diagnosis;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(name = "Medication")
public record MedicationDto(
    @Schema(description = "Name of the prescribed medication.", example = "Tenofovir.") @NotBlank
        String name,
    @Schema(description = "Prescribed dosage of the medication.", example = "300 mg once daily.")
        @NotBlank
        String dose,
    @Schema(description = "Date the medication was prescribed.", example = "2025-01-16") @NotNull
        LocalDate prescriptionDate) {}

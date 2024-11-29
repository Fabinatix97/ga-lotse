/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Schema(name = "Examination")
public record ExaminationDto(
    Boolean hepA,
    Boolean hepB,
    Boolean hepC,
    Boolean hiv,
    Boolean syphilis,
    Boolean gonorrhea,
    Boolean chlamydia,
    @PastOrPresent LocalDate hepADate,
    @PastOrPresent LocalDate hepBDate,
    @PastOrPresent LocalDate hepCDate,
    @PastOrPresent LocalDate hivDate,
    @PastOrPresent LocalDate syphilisDate,
    @PastOrPresent LocalDate gonorrheaDate,
    @PastOrPresent LocalDate chlamydiaDate) {}

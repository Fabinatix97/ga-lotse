/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Schema(name = "Vaccination")
public record VaccinationDto(
    @PastOrPresent LocalDate hepA, @PastOrPresent LocalDate hepB, @PastOrPresent LocalDate hpv) {}

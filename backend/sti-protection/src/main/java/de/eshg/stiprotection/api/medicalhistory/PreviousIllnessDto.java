/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "PreviousIllness")
public record PreviousIllnessDto(
    @NotNull Boolean hepA,
    @NotNull Boolean hepB,
    @NotNull Boolean hepC,
    @NotNull Boolean hiv,
    @NotNull Boolean syphilis,
    @NotNull Boolean gonorrhea,
    @NotNull Boolean chlamydia,
    String otherPreviousIllnesses) {}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.consultation;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(
    name = "Consultation",
    description =
        "Documents detailed patient information, including anamnesis review, medical history, and referrals.")
public record ConsultationDto(
    @Valid GeneralSectionDto general, @Valid PregnancySectionDto pregnancy) {}

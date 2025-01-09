/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.consultation;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = "Consultation")
public record ConsultationDto(
    @Valid GeneralSectionDto general, @Valid PregnancySectionDto pregnancy) {}

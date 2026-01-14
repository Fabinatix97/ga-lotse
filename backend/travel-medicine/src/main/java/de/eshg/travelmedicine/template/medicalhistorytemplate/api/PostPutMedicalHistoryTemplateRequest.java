/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.medicalhistorytemplate.api;

import de.eshg.travelmedicine.template.api.TemplateContentDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostPutMedicalHistoryTemplateRequest(
    @NotNull @Size(max = 200) String title,
    @NotNull MedicalHistoryTemplateStateDto state,
    @NotNull @Valid TemplateContentDto content) {}

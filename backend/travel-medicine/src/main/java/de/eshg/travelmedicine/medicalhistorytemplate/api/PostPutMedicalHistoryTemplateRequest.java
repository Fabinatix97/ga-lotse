/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistorytemplate.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostPutMedicalHistoryTemplateRequest(
    @NotNull @Size(max = 200) String title,
    @NotNull MedicalHistoryTemplateStateDto state,
    @NotNull @Valid MedicalHistoryTemplateContentDto content) {}

/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistory.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PatchMedicalHistoryRequest(
    @NotNull @Valid MedicalHistoryContentDto medicalHistoryContent,
    @Size(max = 4000) String note) {}

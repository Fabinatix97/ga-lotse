/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.medicalhistory.api;

import de.eshg.travelmedicine.document.api.DocumentContentDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record PatchMedicalHistoryRequest(
    @NotNull UUID procedureId,
    @NotNull @Valid DocumentContentDto medicalHistoryContent,
    @Size(max = 4000) String note) {}

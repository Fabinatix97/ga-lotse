/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateMedicalHistoryRequest(@Valid @NotNull MedicalHistoryDto medicalHistory) {}

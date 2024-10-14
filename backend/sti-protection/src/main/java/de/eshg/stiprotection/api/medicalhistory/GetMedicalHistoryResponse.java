/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record GetMedicalHistoryResponse(@NotNull @Valid MedicalHistoryDto medicalHistory) {}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.disease.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetDiseaseInUseResponse(@NotNull List<String> vaccineNames) {}

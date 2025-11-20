/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api.citizen;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetOpeningHoursResponse(@NotNull List<String> de, @NotNull List<String> en) {}

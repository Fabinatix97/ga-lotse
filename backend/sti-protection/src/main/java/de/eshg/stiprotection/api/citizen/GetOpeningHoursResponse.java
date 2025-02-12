/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetOpeningHoursResponse(@NotNull List<String> de, @NotNull List<String> en) {}

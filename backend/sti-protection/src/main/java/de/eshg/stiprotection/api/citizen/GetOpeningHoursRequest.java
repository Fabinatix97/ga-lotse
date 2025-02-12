/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import de.eshg.stiprotection.api.ConcernDto;
import jakarta.validation.constraints.NotNull;

public record GetOpeningHoursRequest(@NotNull ConcernDto concern) {}

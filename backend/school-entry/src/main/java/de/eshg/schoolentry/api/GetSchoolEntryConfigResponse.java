/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.appointmentblock.LocationSelectionMode;
import jakarta.validation.constraints.NotNull;

public record GetSchoolEntryConfigResponse(@NotNull LocationSelectionMode locationSelectionMode) {}

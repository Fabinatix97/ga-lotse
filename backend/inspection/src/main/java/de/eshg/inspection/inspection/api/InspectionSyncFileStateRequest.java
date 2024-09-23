/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import jakarta.validation.constraints.NotNull;

public record InspectionSyncFileStateRequest(@NotNull long facilityVersion) {}

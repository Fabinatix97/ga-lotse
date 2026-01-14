/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenpublic.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetOpeningHoursResponse(@NotNull List<String> de, @NotNull List<String> en) {}

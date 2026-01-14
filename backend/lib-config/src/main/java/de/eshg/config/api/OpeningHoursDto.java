/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Schema(name = "OpeningHours")
public record OpeningHoursDto(@NotEmpty List<String> de, @NotEmpty List<String> en) {}

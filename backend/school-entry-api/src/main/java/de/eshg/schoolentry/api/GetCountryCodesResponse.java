/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@Schema(description = "Possible countries and their group. Expected keys: SchoolEntryCountryCode")
public record GetCountryCodesResponse(@NotNull @Valid Map<String, Integer> countryCodes) {}

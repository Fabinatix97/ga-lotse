/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "LandingElementListConfig")
public record LandingElementListConfigDto(@NotNull List<String> de, @NotNull List<String> en) {}

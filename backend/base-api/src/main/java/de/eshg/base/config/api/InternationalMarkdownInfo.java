/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record InternationalMarkdownInfo(@NotNull @Valid MarkdownInfo de, @Valid MarkdownInfo en) {}

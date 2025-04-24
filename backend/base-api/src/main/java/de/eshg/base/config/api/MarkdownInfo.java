/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.api;

import jakarta.validation.constraints.NotNull;

public record MarkdownInfo(@NotNull String fileName, @NotNull int fileSize) {}

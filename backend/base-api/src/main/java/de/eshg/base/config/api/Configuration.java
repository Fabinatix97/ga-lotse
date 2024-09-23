/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.api;

import jakarta.validation.constraints.NotNull;

public record Configuration(@NotNull long maxFileSize) {}

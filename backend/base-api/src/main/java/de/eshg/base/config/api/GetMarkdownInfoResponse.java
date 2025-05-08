/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.api;

import jakarta.validation.Valid;

public record GetMarkdownInfoResponse<T>(@Valid T markdownInfo) {}

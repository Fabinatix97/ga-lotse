/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "PrivacyDocument")
public record PrivacyDocumentDto(@Valid @NotNull DocumentDto de, @Valid DocumentDto en) {}

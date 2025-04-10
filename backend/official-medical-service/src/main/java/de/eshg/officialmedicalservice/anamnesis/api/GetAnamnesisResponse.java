/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.anamnesis.api;

import jakarta.validation.Valid;

public record GetAnamnesisResponse(@Valid AnamnesisDto anamnesis) {}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.anamnesis.api;

import jakarta.validation.Valid;

public record GetAnamnesisResponse(@Valid AnamnesisDto anamnesis) {}

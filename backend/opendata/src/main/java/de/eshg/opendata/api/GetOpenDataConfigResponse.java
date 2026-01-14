/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import jakarta.validation.Valid;

public record GetOpenDataConfigResponse(@Valid OpenDataConfigDto openDataConfig) {}

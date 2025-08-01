/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config.api;

import jakarta.validation.Valid;

public record GetOmsConfigResponse(@Valid OmsConfigDto configuration) {}

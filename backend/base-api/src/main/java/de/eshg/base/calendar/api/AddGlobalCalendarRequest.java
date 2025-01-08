/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import jakarta.validation.constraints.NotBlank;

public record AddGlobalCalendarRequest(@NotBlank String globalCalendarName) {}

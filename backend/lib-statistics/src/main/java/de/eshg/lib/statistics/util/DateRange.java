/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.util;

import java.time.LocalDate;

public record DateRange(LocalDate start, LocalDate end) implements TemporalRange<LocalDate> {}

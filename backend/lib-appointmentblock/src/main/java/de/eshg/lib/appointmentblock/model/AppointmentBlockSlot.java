/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.model;

import java.time.Instant;

public record AppointmentBlockSlot(Instant start, Instant end) {}

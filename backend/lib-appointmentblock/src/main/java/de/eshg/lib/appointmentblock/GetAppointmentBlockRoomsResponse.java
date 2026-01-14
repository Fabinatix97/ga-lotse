/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetAppointmentBlockRoomsResponse(@NotNull List<String> rooms) {}

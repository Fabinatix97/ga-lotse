/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record AllowedAppointmentTypeCombination(@NotNull List<AppointmentTypeDto> types) {}

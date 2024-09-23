/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateAppointmentTypeRequest(@NotNull @Min(0) int standardDurationInMinutes) {}

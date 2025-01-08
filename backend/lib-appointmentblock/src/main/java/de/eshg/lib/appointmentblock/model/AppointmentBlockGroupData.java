/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.model;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.LocationDto;
import java.util.List;
import java.util.UUID;

public record AppointmentBlockGroupData(
    Long internalId,
    UUID externalId,
    AppointmentTypeDto type,
    int parallelExaminations,
    LocationDto location,
    List<AppointmentBlockData> appointmentBlocks) {}

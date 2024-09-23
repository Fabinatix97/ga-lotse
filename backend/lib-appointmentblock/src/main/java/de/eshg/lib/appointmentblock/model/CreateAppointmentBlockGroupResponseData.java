/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.model;

import java.util.List;
import java.util.UUID;

public record CreateAppointmentBlockGroupResponseData(
    UUID appointmentBlockGroupId, List<UUID> appointmentBlockIds) {}

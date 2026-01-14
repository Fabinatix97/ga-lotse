/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.model.AppointmentBlockGroupData;
import java.util.List;

public record PagedAppointmentBlockGroups(
    List<AppointmentBlockGroupData> appointmentBlockGroupDataPage,
    long totalNumberOfAppointmentBlockGroupData) {}

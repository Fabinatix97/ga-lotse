/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import de.eshg.base.PagedResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetAppointmentBlockGroupsResponse(
    @NotNull @Valid List<GetAppointmentBlockGroupDto> elements, @NotNull long totalNumberOfElements)
    implements PagedResponse<GetAppointmentBlockGroupDto> {}

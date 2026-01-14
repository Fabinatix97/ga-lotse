/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

public record CreateAppointmentsBulkRequest(
    @NotEmpty List<UUID> procedureIds, UUID physicianId, UUID mfaId, UUID sopassId, String room) {}

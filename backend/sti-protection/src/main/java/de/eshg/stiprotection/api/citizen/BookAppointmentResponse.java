/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record BookAppointmentResponse(@NotNull UUID procedureId) {}

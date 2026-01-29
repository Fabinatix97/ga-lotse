/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import java.util.UUID;

public record GetFreeAppointmentsRequest(UUID procedureId) {}

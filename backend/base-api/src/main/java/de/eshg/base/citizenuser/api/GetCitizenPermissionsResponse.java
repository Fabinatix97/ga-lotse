/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetCitizenPermissionsResponse(@NotNull List<CitizenUserRoleDto> permissions) {}

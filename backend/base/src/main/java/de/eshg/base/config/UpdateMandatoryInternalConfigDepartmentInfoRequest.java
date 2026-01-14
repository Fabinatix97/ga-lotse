/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.config.api.DepartmentInfoDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record UpdateMandatoryInternalConfigDepartmentInfoRequest(
    @Valid @NotNull DepartmentInfoDto departmentInfo) {}

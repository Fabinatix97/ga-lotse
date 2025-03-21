/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.departmentinfo.api.DepartmentInfoDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record UpdateMandatoryInternalConfigDepartmentInfoRequest(
    @Valid @NotNull DepartmentInfoDto departmentInfo) {}

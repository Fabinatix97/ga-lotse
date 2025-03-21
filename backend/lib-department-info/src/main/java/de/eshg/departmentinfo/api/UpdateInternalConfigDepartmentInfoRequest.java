/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo.api;

import jakarta.validation.Valid;

public record UpdateInternalConfigDepartmentInfoRequest(@Valid DepartmentInfoDto departmentInfo) {}

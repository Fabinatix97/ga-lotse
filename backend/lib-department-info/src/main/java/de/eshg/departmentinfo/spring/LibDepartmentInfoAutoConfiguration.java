/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo.spring;

import de.eshg.departmentinfo.DepartmentInfoService;
import de.eshg.departmentinfo.OpeningHoursService;
import de.eshg.departmentinfo.domain.DepartmentInfo;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@Import({DepartmentInfoService.class, OpeningHoursService.class})
@AutoConfigurationPackage(basePackageClasses = DepartmentInfo.class)
public class LibDepartmentInfoAutoConfiguration {}

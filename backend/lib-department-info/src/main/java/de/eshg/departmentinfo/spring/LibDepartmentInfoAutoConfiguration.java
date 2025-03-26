/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo.spring;

import de.eshg.departmentinfo.DepartmentInfoConfigController;
import de.eshg.departmentinfo.DepartmentInfoConfigService;
import de.eshg.departmentinfo.OpeningHoursController;
import de.eshg.departmentinfo.OpeningHoursService;
import de.eshg.departmentinfo.PrivacyDocumentController;
import de.eshg.departmentinfo.PrivacyDocumentService;
import de.eshg.departmentinfo.domain.DepartmentInfo;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@Import({
  DepartmentInfoConfigService.class,
  OpeningHoursService.class,
  PrivacyDocumentService.class,
  DepartmentInfoConfigController.class,
  PrivacyDocumentController.class,
  OpeningHoursController.class
})
@AutoConfigurationPackage(basePackageClasses = DepartmentInfo.class)
public class LibDepartmentInfoAutoConfiguration {}

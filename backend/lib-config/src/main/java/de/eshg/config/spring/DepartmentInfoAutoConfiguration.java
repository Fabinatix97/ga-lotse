/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.spring;

import de.eshg.config.departmentinfo.DepartmentInfoConfigController;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.config.departmentinfo.OpeningHoursController;
import de.eshg.config.departmentinfo.OpeningHoursService;
import de.eshg.config.departmentinfo.PrivacyDocumentController;
import de.eshg.config.departmentinfo.PrivacyDocumentService;
import de.eshg.config.domain.DepartmentInfo;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.context.annotation.Import;

@AutoConfiguration(before = ConfigAutoConfiguration.class)
@Import({
  DepartmentInfoConfigService.class,
  OpeningHoursService.class,
  PrivacyDocumentService.class,
  DepartmentInfoConfigController.class,
  PrivacyDocumentController.class,
  OpeningHoursController.class
})
@AutoConfigurationPackage(basePackageClasses = DepartmentInfo.class)
public class DepartmentInfoAutoConfiguration {}

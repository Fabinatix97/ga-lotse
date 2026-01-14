/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.departmentinfo.AbstractOptionalDepartmentInfoConfigController;
import de.eshg.stiprotection.persistence.StiConsultationDepartmentInfoConfig;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(StiConsultationDepartmentInfoConfigController.BASE_URL)
@Tag(name = "StiConsultationDepartmentInfoConfig")
public class StiConsultationDepartmentInfoConfigController
    extends AbstractOptionalDepartmentInfoConfigController<StiConsultationDepartmentInfoConfig> {

  static final String BASE_URL =
      StiConsultationConfigStatusController.BASE_URL + DEPARTMENT_INFO_CONFIG_API_SUFFIX;

  public StiConsultationDepartmentInfoConfigController(
      StiConsultationDepartmentInfoConfigService configService) {
    super(configService);
  }
}

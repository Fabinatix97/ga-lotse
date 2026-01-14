/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.departmentinfo.AbstractOptionalDepartmentInfoConfigController;
import de.eshg.stiprotection.persistence.SexWorkDepartmentInfoConfig;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SexWorkDepartmentInfoConfigController.BASE_URL)
@Tag(name = "SexWorkDepartmentInfoConfig")
public class SexWorkDepartmentInfoConfigController
    extends AbstractOptionalDepartmentInfoConfigController<SexWorkDepartmentInfoConfig> {

  static final String BASE_URL =
      SexWorkConfigStatusController.BASE_URL + DEPARTMENT_INFO_CONFIG_API_SUFFIX;

  public SexWorkDepartmentInfoConfigController(SexWorkDepartmentInfoConfigService configService) {
    super(configService);
  }
}

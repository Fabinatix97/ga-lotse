/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.departmentinfo.AbstractOptionalDepartmentInfoConfigController;
import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import de.eshg.stiprotection.department.SexWorkDepartmentInfoConfigService;
import de.eshg.stiprotection.persistence.SexWorkDepartmentInfoConfig;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(DepartmentInfoLibrary.DEPARTMENT_INFO_API + "/sex-work")
@Tag(name = "SexWorkDepartmentInfoConfig")
public class SexWorkDepartmentInfoConfigController
    extends AbstractOptionalDepartmentInfoConfigController<SexWorkDepartmentInfoConfig> {

  public SexWorkDepartmentInfoConfigController(SexWorkDepartmentInfoConfigService configService) {
    super(configService);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import de.eshg.config.domain.DepartmentInfoConfig;
import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(DepartmentInfoLibrary.DEPARTMENT_INFO_API)
@ConditionalOnBean(DepartmentInfoConfigService.class)
@Tag(name = "DepartmentInfoConfig")
public class DepartmentInfoConfigController
    extends AbstractOptionalDepartmentInfoConfigController<DepartmentInfoConfig> {

  public DepartmentInfoConfigController(DepartmentInfoConfigService configService) {
    super(configService);
  }
}

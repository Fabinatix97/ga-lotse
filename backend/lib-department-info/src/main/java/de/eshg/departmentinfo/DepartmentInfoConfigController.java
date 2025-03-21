/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.departmentinfo.domain.AbstractDepartmentInfoConfig;
import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(DepartmentInfoLibrary.DEPARTMENT_INFO_API)
@ConditionalOnMissingBean(
    value = AbstractDepartmentInfoConfigController.class,
    ignored = DepartmentInfoConfigController.class)
@Tag(name = "DepartmentInfoConfig")
public class DepartmentInfoConfigController<T extends AbstractDepartmentInfoConfig>
    extends AbstractOptionalDepartmentInfoConfigController<T> {

  public DepartmentInfoConfigController(AbstractDepartmentInfoConfigService<T> configService) {
    super(configService);
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static de.eshg.config.mapper.DepartmentInfoMapper.mapToDepartmentInfoDto;

import de.eshg.config.api.GetInternalConfigDepartmentInfoResponse;
import de.eshg.config.domain.AbstractDepartmentInfoConfig;
import de.eshg.config.domain.DepartmentInfo;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

public abstract class AbstractDepartmentInfoConfigController<
    T extends AbstractDepartmentInfoConfig> {

  public static final String DEPARTMENT_INFO_CONFIG_API_SUFFIX = "/department-info";
  final AbstractDepartmentInfoConfigService<T> configService;

  protected AbstractDepartmentInfoConfigController(
      AbstractDepartmentInfoConfigService<T> configService) {
    this.configService = configService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetInternalConfigDepartmentInfoResponse getInternalConfigDepartmentInfo() {
    DepartmentInfo departmentInfo = configService.getInternalConfig().getDepartmentInfo();
    return new GetInternalConfigDepartmentInfoResponse(mapToDepartmentInfoDto(departmentInfo));
  }
}

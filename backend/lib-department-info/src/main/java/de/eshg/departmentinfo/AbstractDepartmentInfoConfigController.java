/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import static de.eshg.departmentinfo.mapper.DepartmentInfoMapper.mapToDepartmentInfoDto;

import de.eshg.departmentinfo.api.GetInternalConfigDepartmentInfoResponse;
import de.eshg.departmentinfo.domain.AbstractDepartmentInfoConfig;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

public abstract class AbstractDepartmentInfoConfigController<
    T extends AbstractDepartmentInfoConfig> {

  protected final AbstractDepartmentInfoConfigService<T> configService;

  protected AbstractDepartmentInfoConfigController(
      AbstractDepartmentInfoConfigService<T> configService) {
    this.configService = configService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetInternalConfigDepartmentInfoResponse getInternalConfigDepartmentInfo() {
    return new GetInternalConfigDepartmentInfoResponse(
        mapToDepartmentInfoDto(configService.getInternalConfig().getDepartmentInfo()));
  }
}

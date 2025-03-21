/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.departmentinfo.api.UpdateInternalConfigDepartmentInfoRequest;
import de.eshg.departmentinfo.domain.AbstractDepartmentInfoConfig;
import de.eshg.departmentinfo.mapper.DepartmentInfoMapper;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class AbstractOptionalDepartmentInfoConfigController<T extends AbstractDepartmentInfoConfig>
    extends AbstractDepartmentInfoConfigController<T> {

  protected AbstractOptionalDepartmentInfoConfigController(
      AbstractDepartmentInfoConfigService<T> configService) {
    super(configService);
  }

  @PutMapping
  @Transactional
  public void updateInternalConfigDepartmentInfo(
      @Valid @RequestBody UpdateInternalConfigDepartmentInfoRequest request) {
    configService.update(DepartmentInfoMapper.mapToDomain(request.departmentInfo()));
  }
}

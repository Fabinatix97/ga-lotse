/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.persistence.BaseDepartmentInfoConfig;
import de.eshg.departmentinfo.AbstractDepartmentInfoConfigController;
import de.eshg.departmentinfo.api.GetInternalConfigDepartmentInfoResponse;
import de.eshg.departmentinfo.mapper.DepartmentInfoMapper;
import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(DepartmentInfoLibrary.DEPARTMENT_INFO_API)
@Tag(name = "BaseDepartmentInfoConfig")
public class BaseDepartmentInfoConfigController
    extends AbstractDepartmentInfoConfigController<BaseDepartmentInfoConfig> {

  private final BaseDepartmentInfoConfigService baseDepartmentInfoConfigService;

  protected BaseDepartmentInfoConfigController(
      BaseDepartmentInfoConfigService baseDepartmentInfoConfigService) {
    super(baseDepartmentInfoConfigService);
    this.baseDepartmentInfoConfigService = baseDepartmentInfoConfigService;
  }

  @Override
  public GetInternalConfigDepartmentInfoResponse getInternalConfigDepartmentInfo() {
    if (baseDepartmentInfoConfigService.isInitialized()) {
      return super.getInternalConfigDepartmentInfo();
    }

    return new GetInternalConfigDepartmentInfoResponse(null);
  }

  @PutMapping
  @Transactional
  public void updateInternalConfigDepartmentInfo(
      @Valid @RequestBody UpdateMandatoryInternalConfigDepartmentInfoRequest request) {
    baseDepartmentInfoConfigService.update(
        DepartmentInfoMapper.mapToDomain(request.departmentInfo()));
  }
}

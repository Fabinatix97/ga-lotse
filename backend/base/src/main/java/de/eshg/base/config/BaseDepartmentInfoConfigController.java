/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.persistence.BaseDepartmentInfoConfig;
import de.eshg.config.api.GetInternalConfigDepartmentInfoResponse;
import de.eshg.config.departmentinfo.AbstractDepartmentInfoConfigController;
import de.eshg.config.departmentinfo.DepartmentInfoConfigController;
import de.eshg.config.mapper.DepartmentInfoMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BaseDepartmentInfoConfigController.BASE_URL)
@Tag(name = "BaseDepartmentInfoConfig")
public class BaseDepartmentInfoConfigController
    extends AbstractDepartmentInfoConfigController<BaseDepartmentInfoConfig> {
  static final String BASE_URL = DepartmentInfoConfigController.BASE_URL;

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

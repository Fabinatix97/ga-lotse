/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.client;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class DepartmentInfoClient {

  private final DepartmentInfoConfigService departmentInfoConfigService;

  private GetDepartmentInfoResponse cachedDepartmentInfo;

  public DepartmentInfoClient(DepartmentInfoConfigService departmentInfoConfigService) {
    this.departmentInfoConfigService = departmentInfoConfigService;
  }

  public GetDepartmentInfoResponse getDepartmentInfo() {
    if (cachedDepartmentInfo == null) {
      cachedDepartmentInfo = departmentInfoConfigService.getDepartmentInfo();
    }
    return cachedDepartmentInfo;
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.departmentinfo.AbstractOptionalDepartmentInfoConfigController;
import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import de.eshg.stiprotection.department.StiConsultationDepartmentInfoConfigService;
import de.eshg.stiprotection.persistence.StiConsultationDepartmentInfoConfig;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(DepartmentInfoLibrary.DEPARTMENT_INFO_API + "/sti-consultation")
@Tag(name = "StiConsultationDepartmentInfoConfig")
public class StiConsultationDepartmentInfoConfigController
    extends AbstractOptionalDepartmentInfoConfigController<StiConsultationDepartmentInfoConfig> {

  public StiConsultationDepartmentInfoConfigController(
      StiConsultationDepartmentInfoConfigService configService) {
    super(configService);
  }
}

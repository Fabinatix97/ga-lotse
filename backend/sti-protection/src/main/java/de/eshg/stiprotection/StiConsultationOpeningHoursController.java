/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.departmentinfo.AbstractOpeningHoursController;
import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import de.eshg.stiprotection.department.StiConsultationOpeningHoursService;
import de.eshg.stiprotection.persistence.StiConsultationOpeningHours;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(DepartmentInfoLibrary.OPENING_HOURS_API + "/sti-consultation")
@Tag(name = "StiConsultationOpeningHours")
public class StiConsultationOpeningHoursController
    extends AbstractOpeningHoursController<StiConsultationOpeningHours> {

  protected StiConsultationOpeningHoursController(
      StiConsultationOpeningHoursService openingHoursService) {
    super(openingHoursService);
  }
}

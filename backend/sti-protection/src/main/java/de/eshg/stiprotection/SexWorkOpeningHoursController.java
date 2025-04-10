/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.config.departmentinfo.AbstractOpeningHoursController;
import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import de.eshg.stiprotection.department.SexWorkOpeningHoursService;
import de.eshg.stiprotection.persistence.SexWorkOpeningHours;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(DepartmentInfoLibrary.OPENING_HOURS_API + "/sex-work")
@Tag(name = "SexWorkOpeningHours")
public class SexWorkOpeningHoursController
    extends AbstractOpeningHoursController<SexWorkOpeningHours> {

  protected SexWorkOpeningHoursController(SexWorkOpeningHoursService openingHoursService) {
    super(openingHoursService);
  }
}

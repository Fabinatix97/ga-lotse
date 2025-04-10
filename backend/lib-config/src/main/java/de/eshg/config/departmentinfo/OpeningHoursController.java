/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import de.eshg.config.domain.OpeningHours;
import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(DepartmentInfoLibrary.OPENING_HOURS_API)
@ConditionalOnBean(OpeningHoursService.class)
@Tag(name = "OpeningHours")
public class OpeningHoursController extends AbstractOpeningHoursController<OpeningHours> {

  protected OpeningHoursController(OpeningHoursService openingHoursService) {
    super(openingHoursService);
  }
}

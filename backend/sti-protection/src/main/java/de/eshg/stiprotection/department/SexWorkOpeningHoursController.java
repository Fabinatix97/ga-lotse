/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.departmentinfo.AbstractOpeningHoursController;
import de.eshg.stiprotection.persistence.SexWorkOpeningHours;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SexWorkOpeningHoursController.BASE_URL)
@Tag(name = "SexWorkOpeningHours")
public class SexWorkOpeningHoursController
    extends AbstractOpeningHoursController<SexWorkOpeningHours> {

  public static final String BASE_URL =
      SexWorkConfigStatusController.BASE_URL + OPENING_HOURS_API_SUFFIX;

  protected SexWorkOpeningHoursController(SexWorkOpeningHoursService openingHoursService) {
    super(openingHoursService);
  }
}

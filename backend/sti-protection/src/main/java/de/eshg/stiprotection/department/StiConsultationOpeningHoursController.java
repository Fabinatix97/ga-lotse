/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.departmentinfo.AbstractOpeningHoursController;
import de.eshg.stiprotection.persistence.StiConsultationOpeningHours;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(StiConsultationOpeningHoursController.BASE_URL)
@Tag(name = "StiConsultationOpeningHours")
public class StiConsultationOpeningHoursController
    extends AbstractOpeningHoursController<StiConsultationOpeningHours> {

  static final String BASE_URL =
      StiConsultationConfigStatusController.BASE_URL + OPENING_HOURS_API_SUFFIX;

  protected StiConsultationOpeningHoursController(
      StiConsultationOpeningHoursService openingHoursService) {
    super(openingHoursService);
  }
}

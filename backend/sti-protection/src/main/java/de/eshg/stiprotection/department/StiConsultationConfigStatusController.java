/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.AbstractConfigStatusController;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(StiConsultationConfigStatusController.BASE_URL)
@Tag(name = "StiConsultationConfigStatus")
class StiConsultationConfigStatusController extends AbstractConfigStatusController {

  static final String BASE_URL =
      BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API + "/sti-consultation";

  StiConsultationConfigStatusController(
      StiConsultationConfigStatusService stiConsultationConfigStatusService) {
    super(stiConsultationConfigStatusService);
  }
}

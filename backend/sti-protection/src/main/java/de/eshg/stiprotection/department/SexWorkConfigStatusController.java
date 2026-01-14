/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.AbstractConfigStatusController;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SexWorkConfigStatusController.BASE_URL)
@Tag(name = "SexWorkConfigStatus")
class SexWorkConfigStatusController extends AbstractConfigStatusController {

  static final String BASE_URL = BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API + "/sex-work";

  SexWorkConfigStatusController(SexWorkConfigStatusService sexWorkConfigStatusService) {
    super(sexWorkConfigStatusService);
  }
}

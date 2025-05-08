/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.SchoolEntryLibConfigController.BASE_URL;

import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import de.eshg.schoolentry.api.configuration.GetSchoolEntryLibConfigResponse;
import de.eshg.schoolentry.api.configuration.UpdateSchoolEntryConfigRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BASE_URL)
@Tag(name = "SchoolEntryLibConfig")
public class SchoolEntryLibConfigController {

  public static final String BASE_URL = DepartmentInfoLibrary.CONFIGURATION_API + "/school-entry";

  private final SchoolEntryConfigService service;

  public SchoolEntryLibConfigController(SchoolEntryConfigService service) {
    this.service = service;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetSchoolEntryLibConfigResponse getSchoolEntryConfig() {
    return new GetSchoolEntryLibConfigResponse(service.getConfiguration());
  }

  @PutMapping
  @Transactional
  public void updateSchoolEntryConfig(@Valid @RequestBody UpdateSchoolEntryConfigRequest request) {
    service.update(request);
  }
}

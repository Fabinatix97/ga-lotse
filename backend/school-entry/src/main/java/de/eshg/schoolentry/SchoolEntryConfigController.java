/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.GetSchoolEntryConfigResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SchoolEntryConfigController.BASE_URL)
@Tag(name = "SchoolEntryConfig")
public class SchoolEntryConfigController {

  public static final String BASE_URL = BaseUrls.SchoolEntry.CONFIG_CONTROLLER;

  private final SchoolEntryConfigService schoolEntryConfigService;
  private final SchoolEntryDeviceRegistryConfigService schoolEntryDeviceRegistryConfigService;

  public SchoolEntryConfigController(
      SchoolEntryConfigService schoolEntryConfigService,
      SchoolEntryDeviceRegistryConfigService schoolEntryDeviceRegistryConfigService) {
    this.schoolEntryConfigService = schoolEntryConfigService;
    this.schoolEntryDeviceRegistryConfigService = schoolEntryDeviceRegistryConfigService;
  }

  @GetMapping
  public GetSchoolEntryConfigResponse getConfig() {
    return new GetSchoolEntryConfigResponse(
        schoolEntryConfigService.getLocationSelectionMode(),
        schoolEntryConfigService.isDirectProcedureTypeAssignmentOnImport());
  }

  @GetMapping("hearing-test")
  @Transactional(readOnly = true)
  public boolean getHearingTestMeasuringConfig() {
    return schoolEntryDeviceRegistryConfigService.getConfiguration().hearingTestDeviceMeasuring();
  }

  @GetMapping("seeing-test")
  @Transactional(readOnly = true)
  public boolean getSeeingTestMeasuringConfig() {
    return schoolEntryDeviceRegistryConfigService.getConfiguration().seeingTestDeviceMeasuring();
  }
}

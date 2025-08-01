/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config;

import de.eshg.inspection.config.api.GetInspectionPropertiesConfigurationResponse;
import de.eshg.inspection.config.api.PutInspectionPropertiesConfigurationRequest;
import de.eshg.inspection.config.mapper.InspectionPropertiesConfigMapper;
import de.eshg.inspection.config.persistence.InspectionPropertiesConfiguration;
import de.eshg.inspection.config.persistence.InspectionPropertiesConfigurationProvider;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "InspectionPropertiesConfig")
class InspectionPropertiesConfigController {

  static final String PROPERTIES_CONFIG_URL =
      BaseUrls.Inspection.CONFIGURATION_API + "/inspection-properties";

  private final InspectionPropertiesConfigService inspectionPropertiesConfigService;
  private final InspectionPropertiesConfigMapper inspectionPropertiesConfigMapper;

  InspectionPropertiesConfigController(
      InspectionPropertiesConfigService inspectionPropertiesConfigService,
      InspectionPropertiesConfigMapper inspectionPropertiesConfigMapper) {
    this.inspectionPropertiesConfigService = inspectionPropertiesConfigService;
    this.inspectionPropertiesConfigMapper = inspectionPropertiesConfigMapper;
  }

  @GetMapping(path = PROPERTIES_CONFIG_URL)
  @Operation(summary = "Get the Inspection properties configuration")
  public GetInspectionPropertiesConfigurationResponse getInspectionPropertiesConfig() {
    InspectionPropertiesConfiguration config = inspectionPropertiesConfigService.getConfiguration();
    return inspectionPropertiesConfigMapper.toInterfaceType(config);
  }

  @PutMapping(path = PROPERTIES_CONFIG_URL)
  @Operation(summary = "Update the Inspection properties configuration")
  public void putInspectionPropertiesConfig(
      @RequestBody @Valid PutInspectionPropertiesConfigurationRequest configRequest) {
    InspectionPropertiesConfigurationProvider updateConfig =
        inspectionPropertiesConfigMapper.toDomainType(configRequest);
    inspectionPropertiesConfigService.updateConfiguration(updateConfig);
  }
}

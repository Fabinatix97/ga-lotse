/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.file.common.FileValidator;
import de.eshg.opendata.api.GetOpenDataConfigResponse;
import de.eshg.opendata.api.UpdateOpenDataConfigRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Tag(name = "OpenDataConfig")
@RequestMapping(OpenDataConfigController.BASE_URL)
class OpenDataConfigController {
  static final String BASE_URL = BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API + "/open-data";
  static final String TERMS_OF_USE_PART = "termsOfUse";
  static final String UPDATE_OPEN_DATA_CONFIG_REQUEST_PART = "updateOpenDataConfigRequest";

  private final OpenDataConfigService openDataConfigService;

  OpenDataConfigController(OpenDataConfigService openDataConfigService) {
    this.openDataConfigService = openDataConfigService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetOpenDataConfigResponse getOpenDataConfig() {
    return new GetOpenDataConfigResponse(
        OpenDataConfigMapper.mapToDto(openDataConfigService.getConfig()));
  }

  @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updateOpenDataConfig(
      @Valid @RequestPart(name = UPDATE_OPEN_DATA_CONFIG_REQUEST_PART)
          UpdateOpenDataConfigRequest updateOpenDataConfigRequest,
      @RequestPart(name = TERMS_OF_USE_PART) MultipartFile termsOfUse)
      throws IOException {
    FileValidator.validatePdfFile(termsOfUse);
    openDataConfigService.updateConfig(
        OpenDataConfigMapper.mapToDomain(updateOpenDataConfigRequest, termsOfUse));
  }
}

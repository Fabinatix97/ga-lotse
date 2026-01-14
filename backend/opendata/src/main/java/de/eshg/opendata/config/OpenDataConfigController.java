/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.file.common.FileValidator;
import de.eshg.opendata.api.GetOpenDataConfigResponse;
import de.eshg.opendata.api.UpdateOpenDataConfigRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.i18n.Language;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
  static final String TERMS_OF_USE_DE_PART = "termsOfUseDe";
  static final String TERMS_OF_USE_EN_PART = "termsOfUseEn";
  static final String UPDATE_OPEN_DATA_CONFIG_REQUEST_PART = "updateOpenDataConfigRequest";
  static final String TERMS_OF_USE_PATH = "/terms-of-use/{lang}";

  private final OpenDataConfigService openDataConfigService;
  private final OpenDataConfigurationProperties configProperties;

  OpenDataConfigController(
      OpenDataConfigService openDataConfigService,
      OpenDataConfigurationProperties configProperties) {
    this.openDataConfigService = openDataConfigService;
    this.configProperties = configProperties;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetOpenDataConfigResponse getOpenDataConfig() {
    return new GetOpenDataConfigResponse(
        OpenDataConfigMapper.mapToDto(openDataConfigService.getConfig()));
  }

  @GetMapping(TERMS_OF_USE_PATH)
  @Transactional(readOnly = true)
  @ApiResponse(responseCode = "200")
  public ResponseEntity<Resource> downloadTermsOfUse(@PathVariable("lang") Language language) {
    OpenDataConfiguration config = openDataConfigService.getConfig();
    if (!config.isInitialized()) {
      throw new NotFoundException("Config is not initialized");
    }
    MultiLangDocument multiLangDocument = config.getTermsOfUse();
    return MultiLangDocumentHelper.getAsResourceByLanguageOrThrow(
        multiLangDocument,
        OpenDataConfigService.TERMS_OF_USE_CONFIG_FILENAME,
        language,
        MediaType.TEXT_MARKDOWN);
  }

  @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updateOpenDataConfig(
      @Valid @RequestPart(name = UPDATE_OPEN_DATA_CONFIG_REQUEST_PART)
          UpdateOpenDataConfigRequest updateOpenDataConfigRequest,
      @RequestPart(name = TERMS_OF_USE_DE_PART) MultipartFile termsOfUseDe,
      @RequestPart(name = TERMS_OF_USE_EN_PART, required = false) MultipartFile termsOfUseEn)
      throws IOException {
    validate(termsOfUseDe);
    validate(termsOfUseEn);
    openDataConfigService.updateConfig(
        OpenDataConfigMapper.mapToDomain(updateOpenDataConfigRequest, termsOfUseDe, termsOfUseEn));
  }

  private void validate(MultipartFile input) {
    if (input == null) {
      return;
    }
    if (input.getSize() > configProperties.maxMarkdownFileSizeBytes()) {
      throw new BadRequestException("File is too large");
    }
    FileValidator.validateMarkdownFile(input);
  }
}

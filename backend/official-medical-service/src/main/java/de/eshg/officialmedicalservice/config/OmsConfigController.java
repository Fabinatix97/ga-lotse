/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.officialmedicalservice.config.api.GetOmsConfigResponse;
import de.eshg.officialmedicalservice.config.api.PutOmsConfigRequest;
import de.eshg.officialmedicalservice.config.persistence.entity.OmsConfiguration;
import de.eshg.rest.service.i18n.Language;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Tag(name = "OmsConfig")
@RequestMapping
class OmsConfigController {

  static final String CONFIG_URL =
      BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API + "/oms-properties";
  static final String CONCERNS_URL = CONFIG_URL + "/concerns";
  static final String LANDING_PAGE_URL = CONFIG_URL + "/landing-page";
  static final String SELECT_CONCERN_INFOBOX_URL = CONFIG_URL + "/select-concern-infobox";

  public static final String PART_CONCERNS = "concerns";
  public static final String PART_LANDING_CONTENT_DE = "landingContent_de";
  public static final String PART_LANDING_CONTENT_EN = "landingContent_en";
  public static final String PART_SELECT_CONCERN_INFOBOX_DE = "selectConcernInfobox_de";
  public static final String PART_SELECT_CONCERN_INFOBOX_EN = "selectConcernInfobox_en";
  public static final String PART_CONFIG_REQUEST = "config_request";

  private static final Logger log = LoggerFactory.getLogger(OmsConfigController.class);

  private final OmsConfigService omsConfigService;
  private final OmsConfigMapper omsConfigMapper;

  OmsConfigController(OmsConfigService omsConfigService, OmsConfigMapper omsConfigMapper) {
    this.omsConfigService = omsConfigService;
    this.omsConfigMapper = omsConfigMapper;
  }

  @GetMapping(OmsConfigController.CONFIG_URL)
  @Operation(
      summary =
          "Get the Official Medical Service configuration, excluding file contents (metadata only)")
  public GetOmsConfigResponse getOmsConfig() {
    OmsConfiguration config = omsConfigService.getConfig();
    if (config.isInitialized()) {
      return omsConfigMapper.toInterfaceType(config);
    } else {
      log.error("getOmsDataConfig(): config isn't intialized.");
      return new GetOmsConfigResponse(null);
    }
  }

  @PutMapping(path = OmsConfigController.CONFIG_URL, consumes = MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Update the Official Medical Service configuration, including file contents")
  public void putOmsConfig(
      @RequestPart(value = PART_CONCERNS, required = false) MultipartFile concerns,
      @RequestPart(value = PART_LANDING_CONTENT_DE, required = false)
          MultipartFile landingContentDe,
      @RequestPart(value = PART_LANDING_CONTENT_EN, required = false)
          MultipartFile landingContentEn,
      @RequestPart(value = PART_SELECT_CONCERN_INFOBOX_DE, required = false)
          MultipartFile selectConcernInfoboxDe,
      @RequestPart(value = PART_SELECT_CONCERN_INFOBOX_EN, required = false)
          MultipartFile selectConcernInfoboxEn,
      @RequestPart(value = PART_CONFIG_REQUEST) @Valid PutOmsConfigRequest configRequest) {

    omsConfigService.updateConfiguration(
        concerns,
        landingContentDe,
        landingContentEn,
        selectConcernInfoboxDe,
        selectConcernInfoboxEn,
        configRequest);
  }

  @GetMapping(OmsConfigController.CONCERNS_URL)
  @Operation(summary = "Download the current definition of concerns (yaml file, all languages)")
  public ResponseEntity<Resource> downloadConcerns() {
    return omsConfigService.downloadConcerns();
  }

  @GetMapping(OmsConfigController.LANDING_PAGE_URL + "/{lang}")
  @Operation(
      summary =
          "Download the current content of the citizen portal landing page (markdown file, one language)")
  public ResponseEntity<Resource> downloadLandingPage(@PathVariable("lang") Language lang) {
    return omsConfigService.downloadLandingPage(lang);
  }

  @GetMapping(OmsConfigController.SELECT_CONCERN_INFOBOX_URL + "/{lang}")
  @Operation(
      summary =
          "Download the current infobox of the citizen portal select concern step (markdown file, one language)")
  public ResponseEntity<Resource> downloadSelectConcernInfobox(
      @PathVariable("lang") Language lang) {
    return omsConfigService.downloadSelectConcernInfobox(lang);
  }
}
